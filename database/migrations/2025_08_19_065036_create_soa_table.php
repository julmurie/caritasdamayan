<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('soa', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();                  // SOA Number
            $table->date('soa_date');                            // SOA Date
            $table->string('cover_period')->nullable();          // e.g. "Jan 1–31, 2025"
            $table->string('charge_slip')->nullable();           // ref / id
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->string('attachment')->nullable();            // file path or URL
            $table->string('status')->default('Pending');        // Pending, Posted, etc.
            $table->timestamps();
            $table->softDeletes();

            $table->index(['soa_date']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('soa');
    }
};
