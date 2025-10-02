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
            $table->string('patient_fname');
            $table->string('patient_lname');
            $table->string('patient_mname')->nullable();
            $table->enum('gender', ['Male', 'Female', 'Others'])->nullable();
            $table->date('birthday')->nullable();
            $table->string('contact_no')->nullable();
            $table->string('address')->nullable();
            $table->string('clinic')->nullable();
            $table->string('parish')->nullable();

            $table->enum('classification_cm', ['FP', 'NFP'])->nullable();
            $table->string('category')->nullable();

            // FP
            $table->string('booklet_no')->nullable();
            $table->boolean('is_head_family')->nullable();

            // NFP
            $table->string('valid_id_no')->nullable();
            $table->boolean('endorsed_as_fp')->nullable()->after('valid_id_no');
            $table->boolean('first_time_visit')->nullable()->after('endorsed_as_fp');

            // Philhealth
            $table->boolean('has_philhealth')->default(false);
            $table->string('philhealth_no')->nullable();

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
