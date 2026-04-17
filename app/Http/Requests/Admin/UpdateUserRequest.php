<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->route('user')->id),
            ],
            'division' => ['nullable', 'string', 'max:255'],
            'is_admin' => ['required', 'boolean'],
        ];
    }

    public function userData(): array
    {
        $validated = $this->validated();

        return [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'division' => $validated['division'] ?? null,
            'is_admin' => $this->boolean('is_admin'),
        ];
    }
}
