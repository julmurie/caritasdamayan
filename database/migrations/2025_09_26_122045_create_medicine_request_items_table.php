<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('medicine_request_items', function (Blueprint $table) {
        $table->id();
        $table->foreignId('medicine_request_id')
              ->constrained('medicine_requests')
              ->onDelete('cascade');
        $table->decimal('unit_cost', 10, 2)->nullable();
        $table->integer('qty')->nullable();
        $table->string('packaging')->nullable();
        $table->string('name');
        $table->string('dosage')->nullable();
        $table->decimal('amount', 10, 2)->nullable();
        $table->string('remarks')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicine_request_items');
    }
};
