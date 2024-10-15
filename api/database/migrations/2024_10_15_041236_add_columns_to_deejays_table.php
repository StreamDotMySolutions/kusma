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
        Schema::table('deejays', function (Blueprint $table) {
            $table->string('facebook')->nullable()->after('description');
            $table->string('instagram')->nullable()->after('facebook');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deejays', function (Blueprint $table) {
            $table->dropColumn('facebook');
            $table->dropColumn('instagram');
        });
    }
};
