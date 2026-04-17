<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tournaments', function (Blueprint $table) {
            $table->string('format')->default('singles')->after('state');
            $table->unsignedTinyInteger('entrant_count')->default(16)->after('format');
            $table->json('entrants')->nullable()->after('entrant_count');
            $table->json('reserve_registration_ids')->nullable()->after('entrants');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tournaments', function (Blueprint $table) {
            $table->dropColumn([
                'format',
                'entrant_count',
                'entrants',
                'reserve_registration_ids',
            ]);
        });
    }
};
