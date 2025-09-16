<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id('patient_id');

            // system / foreign keys (keep nullable for now)
            $table->unsignedBigInteger('cb_by')->nullable();
            $table->unsignedBigInteger('pb_id')->nullable();
            $table->unsignedBigInteger('assessed_by')->nullable();
            $table->unsignedBigInteger('class_id')->nullable();
            $table->unsignedBigInteger('assist_id')->nullable();

            // human fields
            $table->string('patient_lname', 100);
            $table->string('patient_fname', 100);
            $table->string('patient_mname', 100)->nullable();
            $table->string('address', 255)->nullable();
            $table->date('birthday')->nullable();
            $table->enum('gender', ['Male', 'Female'])->nullable();
            $table->string('contact_no', 20)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
