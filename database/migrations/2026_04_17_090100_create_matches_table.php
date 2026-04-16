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
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tournament_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sports_event_id')->constrained()->cascadeOnDelete();
            $table->string('code');
            $table->string('stage');
            $table->string('status')->default('scheduled');
            $table->string('bracket')->nullable();
            $table->string('round_name')->nullable();
            $table->string('group_name')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->foreignId('player_one_registration_id')->nullable()->constrained('registrations')->nullOnDelete();
            $table->foreignId('player_two_registration_id')->nullable()->constrained('registrations')->nullOnDelete();
            $table->unsignedInteger('player_one_score')->nullable();
            $table->unsignedInteger('player_two_score')->nullable();
            $table->foreignId('winner_registration_id')->nullable()->constrained('registrations')->nullOnDelete();
            $table->foreignId('loser_registration_id')->nullable()->constrained('registrations')->nullOnDelete();
            $table->string('winner_to_match_code')->nullable();
            $table->unsignedTinyInteger('winner_to_slot')->nullable();
            $table->string('loser_to_match_code')->nullable();
            $table->unsignedTinyInteger('loser_to_slot')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['tournament_id', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
