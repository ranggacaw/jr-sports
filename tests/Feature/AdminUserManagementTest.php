<?php

namespace Tests\Feature;

use App\Models\SportsEvent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admins_can_access_the_admin_user_management_screen(): void
    {
        $user = User::factory()->create();

        $this->get(route('admin.users.index'))->assertRedirect(route('login'));

        $this->actingAs($user)
            ->get(route('admin.users.index'))
            ->assertForbidden();
    }

    public function test_admin_can_list_create_update_and_archive_users(): void
    {
        $admin = User::factory()->admin()->create();
        $existingUser = User::factory()->create([
            'name' => 'Existing Member',
            'email' => 'existing@example.com',
            'division' => 'Operations',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.users.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->where('users', fn ($users) => collect($users['data'])->contains(fn (array $user) => $user['name'] === 'Existing Member'
                    && $user['email'] === 'existing@example.com'
                    && $user['division'] === 'Operations'
                    && $user['is_admin'] === false
                ))
            );

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'name' => 'Mia Admin',
                'email' => 'mia@example.com',
                'division' => 'Finance',
                'is_admin' => true,
                'password' => 'secure-password',
                'password_confirmation' => 'secure-password',
            ])
            ->assertRedirect(route('admin.users.index'));

        $createdUser = User::query()->where('email', 'mia@example.com')->firstOrFail();

        $this->assertSame('Finance', $createdUser->division);
        $this->assertTrue($createdUser->is_admin);
        $this->assertTrue(Hash::check('secure-password', $createdUser->password));

        $this->actingAs($admin)
            ->put(route('admin.users.update', $createdUser), [
                'name' => 'Mia Coach',
                'email' => 'mia@example.com',
                'division' => 'Sports Ops',
                'is_admin' => false,
            ])
            ->assertRedirect(route('admin.users.index'));

        $createdUser->refresh();

        $this->assertSame('Mia Coach', $createdUser->name);
        $this->assertSame('Sports Ops', $createdUser->division);
        $this->assertFalse($createdUser->is_admin);

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $createdUser))
            ->assertRedirect(route('admin.users.index'));

        $this->assertSoftDeleted('users', ['id' => $createdUser->id]);

        $this->actingAs($admin)
            ->get(route('admin.users.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->where('users', fn ($users) => ! collect($users['data'])->pluck('email')->contains('mia@example.com'))
            );
    }

    public function test_admin_can_search_for_user_by_name_or_email(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->create([
            'name' => 'Alpha Bravo',
            'email' => 'alpha@example.com',
        ]);
        User::factory()->create([
            'name' => 'Charlie Delta',
            'email' => 'charlie@delta.test',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.users.index', ['search' => 'alpha']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->has('users.data', 1)
                ->where('users.data.0.name', 'Alpha Bravo')
            );

        $this->actingAs($admin)
            ->get(route('admin.users.index', ['search' => 'delta.test']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->has('users.data', 1)
                ->where('users.data.0.name', 'Charlie Delta')
            );
    }

    public function test_archiving_a_user_preserves_event_history_and_blocks_future_login(): void
    {
        $admin = User::factory()->admin()->create();
        $viewer = User::factory()->create(['name' => 'Viewer User']);
        $archivedUser = User::factory()->create([
            'name' => 'Archived Player',
            'email' => 'archived@example.com',
            'password' => 'password',
        ]);
        $event = SportsEvent::factory()->create();

        $event->registrations()->createMany([
            ['user_id' => $viewer->id],
            ['user_id' => $archivedUser->id],
        ]);

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $archivedUser))
            ->assertRedirect(route('admin.users.index'));

        $this->assertSoftDeleted('users', ['id' => $archivedUser->id]);
        $this->assertDatabaseCount('registrations', 2);

        $this->actingAs($viewer)
            ->get(route('events.show', $event))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Events/Show')
                ->where('event.participants_count', 2)
                ->where('event.participants', fn ($participants) => collect($participants)->pluck('name')->all() === ['Archived Player', 'Viewer User'])
            );

        $this->post(route('logout'));

        $this->post(route('login'), [
            'email' => 'archived@example.com',
            'password' => 'password',
        ])
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }
}
