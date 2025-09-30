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
        Schema::create('patients', function (Blueprint $table) {
            $table->id('patient_id');

            // Basic info
            $table->string('patient_no')->nullable();
            $table->string('patient_code')->nullable();
            $table->string('patient_fname');
            $table->string('patient_lname');
            $table->string('patient_mname')->nullable();
            $table->enum('gender', ['Male', 'Female', 'Others']);
            $table->date('birthday')->nullable();
            $table->string('contact_no')->nullable();
            $table->string('address')->nullable();

            // Extra info
            $table->string('clinic')->nullable();
            $table->string('parish')->nullable();

            // Classification FP / NFP
            $table->enum('classification_cm', ['FP', 'NFP'])->nullable();
            $table->string('booklet_no')->nullable();
            $table->boolean('is_head_family')->default(false);

            // NFP fields
            $table->string('valid_id_no')->nullable();
            $table->boolean('endorsed_as_fp')->default(false);
            $table->boolean('first_time_visit')->default(false);

            // Category
            $table->string('category')->nullable();

            // PhilHealth
            $table->boolean('has_philhealth')->default(false);
            $table->string('philhealth_no')->nullable();

            // Archive support
            $table->boolean('archived')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
