<?php

namespace Database\Seeders;

use App\Models\SportsEvent;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // --- Venues ---
        $mainCenter = Venue::factory()->create([
            'name'           => 'JR Sports Center',
            'address'        => 'Jl. Sudirman No. 10',
            'city'           => 'Jakarta',
            'google_maps_url' => 'https://maps.google.com/?q=Jl.+Sudirman+No.+10+Jakarta',
        ]);

        $eastArena = Venue::factory()->create([
            'name'           => 'JR East Arena',
            'address'        => 'Jl. Pemuda No. 45',
            'city'           => 'Jakarta',
            'google_maps_url' => 'https://maps.google.com/?q=Jl.+Pemuda+No.+45+Jakarta',
        ]);

        $southCourt = Venue::factory()->create([
            'name'           => 'JR South Court',
            'address'        => 'Jl. Fatmawati No. 88',
            'city'           => 'Jakarta',
            'google_maps_url' => 'https://maps.google.com/?q=Jl.+Fatmawati+No.+88+Jakarta',
        ]);

        $westSports = Venue::factory()->create([
            'name'           => 'JR West Sports Hall',
            'address'        => 'Jl. Kebon Jeruk No. 22',
            'city'           => 'Jakarta',
            'google_maps_url' => 'https://maps.google.com/?q=Jl.+Kebon+Jeruk+No.+22+Jakarta',
        ]);

        // --- Sports Events ---
        // FUTSAL
        SportsEvent::factory()->create([
            'venue_id'   => $mainCenter->id,
            'name'       => 'Friday Futsal Night',
            'recurrence' => 'Weekly',
            'starts_at'  => now()->next('Friday')->setTime(18, 30),
            'ends_at'    => now()->next('Friday')->setTime(20, 0),
        ]);

        SportsEvent::factory()->create([
            'venue_id'   => $eastArena->id,
            'name'       => 'Daily Futsal Morning',
            'recurrence' => 'Daily',
            'starts_at'  => now()->addDay()->setTime(7, 0),
            'ends_at'    => now()->addDay()->setTime(8, 30),
        ]);

        // BADMINTON
        SportsEvent::factory()->create([
            'venue_id'   => $mainCenter->id,
            'name'       => 'Badminton Morning Session',
            'recurrence' => 'Daily',
            'starts_at'  => now()->addDay()->setTime(6, 0),
            'ends_at'    => now()->addDay()->setTime(8, 0),
        ]);

        SportsEvent::factory()->create([
            'venue_id'   => $southCourt->id,
            'name'       => 'Saturday Badminton Championship',
            'recurrence' => 'Weekly',
            'starts_at'  => now()->next('Saturday')->setTime(9, 0),
            'ends_at'    => now()->next('Saturday')->setTime(12, 0),
        ]);

        // BASKETBALL
        SportsEvent::factory()->create([
            'venue_id'   => $eastArena->id,
            'name'       => 'Basketball Pickup Game',
            'recurrence' => 'Weekly',
            'starts_at'  => now()->next('Sunday')->setTime(16, 0),
            'ends_at'    => now()->next('Sunday')->setTime(18, 0),
        ]);

        SportsEvent::factory()->create([
            'venue_id'   => $mainCenter->id,
            'name'       => 'Daily Basketball Drills',
            'recurrence' => 'Daily',
            'starts_at'  => now()->addDay()->setTime(17, 0),
            'ends_at'    => now()->addDay()->setTime(19, 0),
        ]);

        // TENNIS
        SportsEvent::factory()->create([
            'venue_id'   => $southCourt->id,
            'name'       => 'Tennis Open Court',
            'recurrence' => 'Daily',
            'starts_at'  => now()->addDay()->setTime(8, 0),
            'ends_at'    => now()->addDay()->setTime(10, 0),
        ]);

        SportsEvent::factory()->create([
            'venue_id'   => $westSports->id,
            'name'       => 'Sunday Tennis Doubles',
            'recurrence' => 'Weekly',
            'starts_at'  => now()->next('Sunday')->setTime(7, 0),
            'ends_at'    => now()->next('Sunday')->setTime(9, 30),
        ]);

        // MINI SOCCER
        SportsEvent::factory()->create([
            'venue_id'   => $westSports->id,
            'name'       => 'Mini Soccer Evening',
            'recurrence' => 'Daily',
            'starts_at'  => now()->addDay()->setTime(19, 0),
            'ends_at'    => now()->addDay()->setTime(21, 0),
        ]);

        SportsEvent::factory()->create([
            'venue_id'   => $eastArena->id,
            'name'       => 'Wednesday Mini Soccer League',
            'recurrence' => 'Weekly',
            'starts_at'  => now()->next('Wednesday')->setTime(18, 0),
            'ends_at'    => now()->next('Wednesday')->setTime(20, 0),
        ]);

        // FOOTBALL
        SportsEvent::factory()->create([
            'venue_id'   => $eastArena->id,
            'name'       => 'Saturday Football Match',
            'recurrence' => 'Weekly',
            'starts_at'  => now()->next('Saturday')->setTime(15, 0),
            'ends_at'    => now()->next('Saturday')->setTime(17, 0),
        ]);

        SportsEvent::factory()->create([
            'venue_id'   => $westSports->id,
            'name'       => 'Daily Football Training',
            'recurrence' => 'Daily',
            'starts_at'  => now()->addDay()->setTime(16, 0),
            'ends_at'    => now()->addDay()->setTime(18, 0),
        ]);

        // PADEL
        SportsEvent::factory()->create([
            'venue_id'   => $southCourt->id,
            'name'       => 'Padel Morning Rally',
            'recurrence' => 'Daily',
            'starts_at'  => now()->addDay()->setTime(9, 0),
            'ends_at'    => now()->addDay()->setTime(11, 0),
        ]);

        SportsEvent::factory()->create([
            'venue_id'   => $mainCenter->id,
            'name'       => 'Thursday Padel Tournament',
            'recurrence' => 'Weekly',
            'starts_at'  => now()->next('Thursday')->setTime(17, 0),
            'ends_at'    => now()->next('Thursday')->setTime(20, 0),
        ]);

        // --- Users ---
        $admin = User::factory()->create([
            'name'     => 'Admin User',
            'email'    => 'admin@example.com',
            'is_admin' => true,
        ]);

        $testUser = User::factory()->create([
            'name'  => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Generate more diverse users
        $users = User::factory(20)->create();

        // Let's get all created events
        $events = SportsEvent::all();

        // Assign random participants to each event to make the data dynamic
        foreach ($events as $event) {
            // Random number of participants between 2 and 10
            $participantsCount = rand(2, 10);
            $eventUsers = $users->random($participantsCount);

            foreach ($eventUsers as $user) {
                \App\Models\Registration::factory()->create([
                    'sports_event_id' => $event->id,
                    'user_id'         => $user->id,
                ]);
            }
        }
    }
}
