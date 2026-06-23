<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a paginated list of users for Inertia.
     */
    public function index(Request $request): Response
    {
        $perPage = (int) $request->get('per_page', 15);

        $users = User::orderBy('id', 'desc')->paginate($perPage)->withQueryString();

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a user.
     */
    public function create(): Response
    {
        return Inertia::render('users/create');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => $user,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $payload = [
            'name' => trim($data['first_name'].' '.$data['last_name']),
            'email' => $data['email'],
            'password' => $data['password'],
        ];

        // Only allow setting is_admin if current user can manage users
        if ($request->user() && $request->user()->can('manage', User::class)) {
            $isAdmin = $request->boolean('is_admin');
            $payload['is_admin'] = $isAdmin;
        }

        $user = User::create($payload);

        return redirect()->route('users.index');
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
        ]);

        $payload = [
            'name' => trim($data['first_name'].' '.$data['last_name']),
            'email' => $data['email'],
        ];

        if ($request->user() && $request->user()->can('manage', User::class)) {
            // allow setting is_admin on update when authorized
            $payload['is_admin'] = $request->boolean('is_admin');
        }

        $user->update($payload);

        return redirect()->route('users.index');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        // Soft-delete if model uses SoftDeletes, otherwise hard delete
        $user->delete();

        return redirect()->route('users.index');
    }
}
