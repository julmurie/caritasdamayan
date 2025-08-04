<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            
            // Authentication fields
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            
            // Role management - updated to match frontend values exactly
            $table->enum('role', [
                'admin',
                'volunteer', // Changed from clinic_volunteer to match frontend
                'merchant',  // Changed from partner_merchant to match frontend
                'accounting',
                'treasury'
            ])->default('volunteer'); // Updated default to match new value
            
            // Personal information
            $table->string('firstname')->nullable();
            $table->string('lastname')->nullable();
            $table->string('name')->virtualAs('CONCAT(firstname, " ", lastname)');
            $table->text('job_description')->nullable();
            
            // Merchant-specific fields
            $table->string('branch_name')->nullable();
            $table->enum('merchant_type', ['product', 'lab']) // Changed from laboratory_service to match frontend
                  ->nullable();
            
            // Account status
            $table->boolean('is_active')->default(true);
            $table->unsignedTinyInteger('attempts_left')->default(5);
            
            // Timestamps
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['role', 'is_active']);
        });

        // Keep existing password_reset_tokens and sessions tables
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};