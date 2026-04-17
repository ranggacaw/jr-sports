<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$e = new App\Models\SportsEvent();
$e->load('registrations.user');
var_dump($e->relationLoaded('registrations'));
