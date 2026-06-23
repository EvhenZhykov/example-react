<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Log;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can manage users (general guard).
     */
    public function manage(User $actor): bool
    {
        // Allow if user has is_admin attribute truthy or matches configured admin email
        $isAdmin = (bool) ($actor->is_admin ?? false);
        $adminEmail = config('app.admin_email');
        $isAdminByEmail = $adminEmail && $actor->email === $adminEmail;
        $allowed = $isAdmin || $isAdminByEmail;

        Log::info('UserPolicy::manage check', [
            'actor_id' => $actor->id ?? null,
            'actor_email' => $actor->email ?? null,
            'actor_is_admin' => $actor->is_admin ?? null,
            'config_admin_email' => $adminEmail ?? null,
            'allowed' => $allowed,
        ]);

        return $allowed;
    }

    public function viewAny(User $actor): bool
    {
        return $this->manage($actor);
    }

    public function view(User $actor, User $model): bool
    {
        return $this->manage($actor);
    }

    public function create(User $actor): bool
    {
        return $this->manage($actor);
    }

    public function update(User $actor, User $model): bool
    {
        return $this->manage($actor);
    }

    public function delete(User $actor, User $model): bool
    {
        return $this->manage($actor);
    }
}
