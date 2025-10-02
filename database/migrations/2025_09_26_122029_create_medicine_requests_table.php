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
    Schema::create('medicine_requests', function (Blueprint $table) {
        $table->id();
        $table->date('date')->nullable();
        $table->string('all_is_well')->nullable();
        $table->string('partner_institution_branch')->nullable();
        $table->string('clinic_name')->nullable();
        $table->string('partner_institution_name')->nullable();
        $table->string('parish_name')->nullable();
        $table->string('parish_address')->nullable();
        $table->enum('partner_type', ['Family Partner', 'Non-Family Partner']);

        // Patient details
        $table->string('patient_surname')->nullable();
        $table->string('patient_firstname')->nullable();
        $table->string('patient_mi', 5)->nullable();
        $table->integer('patient_age')->nullable();
        $table->string('patient_address')->nullable();
        $table->string('patient_contact_number')->nullable();
        $table->string('patient_government_id')->nullable();
        $table->string('patient_diagnosis')->nullable();

        // Summary
        $table->decimal('subtotal_a', 10, 2)->nullable();
        $table->decimal('subtotal_b', 10, 2)->nullable();
        $table->decimal('grand_total', 10, 2)->nullable();
        $table->string('total_amount_words')->nullable();

        // Approval & signatories
        $table->string('prepared_by')->nullable();
        $table->date('prepared_by_date')->nullable();
        $table->string('approved_by')->nullable();
        $table->date('approved_by_date')->nullable();
        $table->string('received_by_client')->nullable();
        $table->date('received_by_client_date')->nullable();
        $table->string('authorized_representative')->nullable();
        $table->date('authorized_representative_date')->nullable();

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicine_requests');
    }
};
