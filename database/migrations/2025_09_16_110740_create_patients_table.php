<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
    Schema::create('patients', function (Blueprint $table) {
        $table->id('patient_id');
        $table->string('patient_fname');
        $table->string('patient_lname');
        $table->string('patient_mname')->nullable();
        $table->enum('gender', ['Male', 'Female', 'Others']);
        $table->date('birthday')->nullable();
        $table->string('contact_no')->nullable();
        $table->string('address')->nullable();
        $table->string('clinic')->nullable();
        $table->string('parish')->nullable();

        // Classification: FP / NFP
        $table->enum('classification_cm', ['FP', 'NFP'])->nullable();

        // Sub-questions for FP
        $table->string('booklet_no')->nullable();
        $table->boolean('is_head_family')->default(false);

        // Sub-questions for NFP
        $table->string('valid_id_no')->nullable();
        $table->boolean('endorsed_as_fp')->default(false);
        $table->boolean('first_time_visit')->default(false);

        // Category (see Annex 2 list)
        $table->string('category')->nullable();

        $table->timestamps();
    });
}
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
