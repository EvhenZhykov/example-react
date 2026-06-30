<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$before = DB::table('login_logs')->count();

// Delete duplicates: keep lowest id for each unique tuple
DB::statement("DELETE l1 FROM login_logs l1
    INNER JOIN login_logs l2
    WHERE
      l1.id > l2.id
      AND l1.user_id <=> l2.user_id
      AND l1.ip_address <=> l2.ip_address
      AND l1.user_agent <=> l2.user_agent
      AND l1.created_at = l2.created_at");

$after = DB::table('login_logs')->count();

echo "before: $before\n";
echo "after: $after\n";
