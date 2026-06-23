<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Gate;

$u = User::where('email', 'yevhen.z@theevenstar.net')->first();
if (! $u) {
    echo "no user found\n";
    exit(0);
}

$allowed = Gate::forUser($u)->allows('manage', User::class);

echo json_encode([
    'email' => $u->email,
    'is_admin' => (bool) $u->is_admin,
    'gate_allows' => (bool) $allowed,
]);
