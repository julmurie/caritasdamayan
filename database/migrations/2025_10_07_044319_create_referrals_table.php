<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('referrals', function (Blueprint $table) {
            $table->id();
            // (optional) who created it
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // meta
            $table->date('date')->nullable();
            $table->string('ref_control_no')->nullable();
            $table->boolean('issuing_program_cia')->default(false);
            $table->boolean('issuing_program_gen129')->default(false);
            $table->boolean('issuing_program_alliswell')->default(false);
            $table->string('other_programs')->nullable();
            $table->string('referred_to')->nullable();

            // client block
            $table->string('client_name')->nullable();
            $table->string('diagnosis')->nullable();
            $table->string('contact_no')->nullable();
            $table->string('address')->nullable();
            $table->string('parish_name')->nullable();
            $table->string('diocese')->nullable();
            $table->string('partner_type')->nullable(); // "Family Partner" or "Non Family Partner"
            $table->string('fp_booklet_no')->nullable();
            $table->string('valid_id_presented')->nullable();

            // narrative
            $table->text('initial_provided')->nullable();

            // docs
            $table->string('documents_other')->nullable();

            $table->timestamps();
        });

        Schema::create('referral_assistances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('referral_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('referral_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('referral_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('referral_documents');
        Schema::dropIfExists('referral_assistances');
        Schema::dropIfExists('referrals');
    }
};
