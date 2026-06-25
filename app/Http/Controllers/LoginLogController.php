<?php

namespace App\Http\Controllers;

use App\Models\LoginLog;
use Inertia\Inertia;
use Illuminate\Http\Request;

class LoginLogController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 15);

        $logs = LoginLog::with('user')
            ->orderBy('id', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('users/logins', [
            'logs' => $logs,
        ]);
    }
}
