App\Models\SportsEvent::where('name', 'not like', '%badminton%')->delete(); App\Models\SportsEvent::factory()->count(4)->create(['name' => 'Badminton Session']);
