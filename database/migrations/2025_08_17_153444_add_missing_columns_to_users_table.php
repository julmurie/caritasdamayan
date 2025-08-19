<?php
// database/migrations/2025_08_17_120000_add_missing_columns_to_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // --- Role (enum) ---
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['admin','volunteer','merchant','accounting','treasury'])
                      ->default('volunteer')
                      ->after('password');
            }

            // --- Names (keep existing 'name' if present; we only add first/last) ---
            if (!Schema::hasColumn('users', 'firstname')) {
                $table->string('firstname')->nullable()->after('role');
            }
            if (!Schema::hasColumn('users', 'lastname')) {
                $table->string('lastname')->nullable()->after('firstname');
            }

            // --- Job description ---
            if (!Schema::hasColumn('users', 'job_description')) {
                $table->text('job_description')->nullable()->after('lastname');
            }

            // --- Merchant-specific fields ---
            if (!Schema::hasColumn('users', 'branch_name')) {
                $table->string('branch_name')->nullable()->after('job_description');
            }
            if (!Schema::hasColumn('users', 'merchant_type')) {
                $table->enum('merchant_type', ['product','lab'])->nullable()->after('branch_name');
            }

            // --- Account status ---
            if (!Schema::hasColumn('users', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('merchant_type');
            }

            // --- Login attempts + timed lockout ---
            if (!Schema::hasColumn('users', 'attempts_left')) {
                $table->unsignedTinyInteger('attempts_left')->default(5)->after('is_active');
            }
            if (!Schema::hasColumn('users', 'locked_until')) {
                $table->timestamp('locked_until')->nullable()->after('attempts_left');
            }

            // --- Soft deletes ---
            if (!Schema::hasColumn('users', 'deleted_at')) {
                $table->softDeletes(); // adds nullable deleted_at
            }

            // --- Helpful index (role + is_active) ---
            // Original Laravel table won’t have this; name it explicitly.
            $indexName = 'users_role_is_active_index';
            try {
                $table->index(['role', 'is_active'], $indexName);
            } catch (\Throwable $e) {
                // ignore if it already exists or the combo isn't present yet
            }
        });

        // Backfill sensible defaults for existing rows (in case they come in as NULL)
        // (safe to run repeatedly)
        if (Schema::hasColumn('users', 'attempts_left')) {
            DB::table('users')->whereNull('attempts_left')->update(['attempts_left' => 5]);
        }
        if (Schema::hasColumn('users', 'is_active')) {
            DB::table('users')->whereNull('is_active')->update(['is_active' => true]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the index if we created it
            $indexName = 'users_role_is_active_index';
            try { $table->dropIndex($indexName); } catch (\Throwable $e) {}

            // Drop additive columns (only if they exist)
            foreach ([
                'locked_until',
                'attempts_left',
                'is_active',
                'merchant_type',
                'branch_name',
                'job_description',
                'lastname',
                'firstname',
                'role',
            ] as $col) {
                if (Schema::hasColumn('users', $col)) {
                    $table->dropColumn($col);
                }
            }

            // Soft deletes column
            if (Schema::hasColumn('users', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });
    }
};
