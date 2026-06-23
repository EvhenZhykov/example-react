<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can manage users (general guard).
     */
    public function manage(User $actor): bool
    {
        // Allow if user has is_admin attribute truthy or matches configured admin email
        if (property_exists($actor, 'is_admin') && ($actor->is_admin ?? false)) {
            return true;
        }

        $adminEmail = config('app.admin_email');

        if ($adminEmail && $actor->email === $adminEmail) {
            return true;
        }

        return false;
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
