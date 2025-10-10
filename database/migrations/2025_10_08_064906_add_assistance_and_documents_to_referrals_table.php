<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('referrals', function (Blueprint $table) {
            // store the array data as JSON
            $table->json('assistance')->nullable()->after('documents_other');
            $table->json('documents')->nullable()->after('assistance');
        });
    }

    public function down(): void
    {
        Schema::table('referrals', function (Blueprint $table) {
            $table->dropColumn(['assistance', 'documents']);
        });
    }
};
