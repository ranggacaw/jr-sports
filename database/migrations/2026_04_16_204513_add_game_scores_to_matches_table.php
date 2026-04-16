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
        Schema::table('matches', function (Blueprint $table) {
            $table->unsignedTinyInteger('g1_p1_score')->nullable();
            $table->unsignedTinyInteger('g1_p2_score')->nullable();
            
            $table->unsignedTinyInteger('g2_p1_score')->nullable();
            $table->unsignedTinyInteger('g2_p2_score')->nullable();
            
            $table->unsignedTinyInteger('g3_p1_score')->nullable();
            $table->unsignedTinyInteger('g3_p2_score')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('matches', function (Blueprint $table) {
            $table->dropColumn([
                'g1_p1_score', 'g1_p2_score',
                'g2_p1_score', 'g2_p2_score',
                'g3_p1_score', 'g3_p2_score',
            ]);
        });
    }
};
