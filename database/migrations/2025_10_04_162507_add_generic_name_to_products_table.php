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
    Schema::table('products', function (Blueprint $table) {
        $table->string('generic_name', 100)->nullable()->after('name');
    });

    // copy values
    DB::table('products')->update(['generic_name' => DB::raw('name')]);

    // if you’re confident all rows are filled:
    Schema::table('products', function (Blueprint $table) {
        $table->string('generic_name', 100)->nullable(false)->change();
    });
}

public function down(): void
{
    Schema::table('products', function (Blueprint $table) {
        $table->dropColumn('generic_name');
    });
}

};
