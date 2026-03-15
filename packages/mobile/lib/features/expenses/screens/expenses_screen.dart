import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../../core/theme/app_colors.dart';

// ---------------------------------------------------------------------------
// DATA MODELS
// ---------------------------------------------------------------------------

enum ExpenseCategory { food, transport, accommodation, activity, shopping }

extension ExpenseCategoryX on ExpenseCategory {
  String get label {
    switch (this) {
      case ExpenseCategory.food:
        return 'Food';
      case ExpenseCategory.transport:
        return 'Transport';
      case ExpenseCategory.accommodation:
        return 'Accommodation';
      case ExpenseCategory.activity:
        return 'Activity';
      case ExpenseCategory.shopping:
        return 'Shopping';
    }
  }

  IconData get icon {
    switch (this) {
      case ExpenseCategory.food:
        return Icons.restaurant;
      case ExpenseCategory.transport:
        return Icons.directions_car;
      case ExpenseCategory.accommodation:
        return Icons.hotel;
      case ExpenseCategory.activity:
        return Icons.hiking;
      case ExpenseCategory.shopping:
        return Icons.shopping_bag;
    }
  }

  Color get color {
    switch (this) {
      case ExpenseCategory.food:
        return AppColors.badgeFoodie;
      case ExpenseCategory.transport:
        return AppColors.info;
      case ExpenseCategory.accommodation:
        return AppColors.badgeCulture;
      case ExpenseCategory.activity:
        return AppColors.badgeAdventure;
      case ExpenseCategory.shopping:
        return AppColors.badgeSocial;
    }
  }
}

enum SplitType { equal, custom }

class Expense {
  final String id;
  final double amount;
  final String currency;
  final ExpenseCategory category;
  final String merchant;
  final DateTime date;
  final String tripId;
  final String tripName;
  final String? paidBy;
  final SplitType? splitType;
  final Map<String, double>? customSplit;
  final String? receiptUrl;
  final String? ocrText;
  final bool isGroupExpense;

  const Expense({
    required this.id,
    required this.amount,
    required this.currency,
    required this.category,
    required this.merchant,
    required this.date,
    required this.tripId,
    required this.tripName,
    this.paidBy,
    this.splitType,
    this.customSplit,
    this.receiptUrl,
    this.ocrText,
    this.isGroupExpense = false,
  });
}

class TripBudget {
  final String tripId;
  final String tripName;
  final double totalBudget;
  final Map<ExpenseCategory, double> categoryBudgets;

  const TripBudget({
    required this.tripId,
    required this.tripName,
    required this.totalBudget,
    required this.categoryBudgets,
  });
}

class DebtEntry {
  final String from;
  final String to;
  final double amount;
  final String currency;

  const DebtEntry({
    required this.from,
    required this.to,
    required this.amount,
    required this.currency,
  });
}

// ---------------------------------------------------------------------------
// PROVIDERS
// ---------------------------------------------------------------------------

final expensesProvider = StateNotifierProvider<ExpensesNotifier, List<Expense>>(
  (ref) => ExpensesNotifier(),
);

class ExpensesNotifier extends StateNotifier<List<Expense>> {
  ExpensesNotifier() : super(_sampleExpenses);

  void addExpense(Expense expense) {
    state = [expense, ...state];
  }

  void removeExpense(String id) {
    state = state.where((e) => e.id != id).toList();
  }
}

final selectedTripFilterProvider = StateProvider<String?>((ref) => null);
final selectedCategoryFilterProvider =
    StateProvider<ExpenseCategory?>((ref) => null);
final dateRangeFilterProvider = StateProvider<DateTimeRange?>((ref) => null);

final filteredExpensesProvider = Provider<List<Expense>>((ref) {
  final expenses = ref.watch(expensesProvider);
  final tripFilter = ref.watch(selectedTripFilterProvider);
  final categoryFilter = ref.watch(selectedCategoryFilterProvider);
  final dateRange = ref.watch(dateRangeFilterProvider);

  return expenses.where((e) {
    if (tripFilter != null && e.tripId != tripFilter) return false;
    if (categoryFilter != null && e.category != categoryFilter) return false;
    if (dateRange != null) {
      if (e.date.isBefore(dateRange.start) || e.date.isAfter(dateRange.end)) {
        return false;
      }
    }
    return true;
  }).toList();
});

final tripBudgetProvider = Provider<TripBudget>((ref) {
  return const TripBudget(
    tripId: 'trip1',
    tripName: 'Mumbai \u2192 Goa',
    totalBudget: 50000,
    categoryBudgets: {
      ExpenseCategory.food: 12000,
      ExpenseCategory.transport: 15000,
      ExpenseCategory.accommodation: 15000,
      ExpenseCategory.activity: 5000,
      ExpenseCategory.shopping: 3000,
    },
  );
});

final debtsProvider = Provider<List<DebtEntry>>((ref) {
  return const [
    DebtEntry(from: 'Arjun', to: 'You', amount: 1250, currency: 'INR'),
    DebtEntry(from: 'You', to: 'Priya', amount: 800, currency: 'INR'),
    DebtEntry(from: 'Ravi', to: 'You', amount: 2100, currency: 'INR'),
    DebtEntry(from: 'Priya', to: 'Arjun', amount: 650, currency: 'INR'),
  ];
});

// Sample data
final _sampleExpenses = [
  Expense(
    id: '1',
    amount: 1200,
    currency: 'INR',
    category: ExpenseCategory.food,
    merchant: 'Konkan Rasoi',
    date: DateTime(2026, 3, 8),
    tripId: 'trip1',
    tripName: 'Mumbai \u2192 Goa',
    paidBy: 'You',
    isGroupExpense: true,
    splitType: SplitType.equal,
  ),
  Expense(
    id: '2',
    amount: 3500,
    currency: 'INR',
    category: ExpenseCategory.transport,
    merchant: 'Petrol - HP Pump',
    date: DateTime(2026, 3, 7),
    tripId: 'trip1',
    tripName: 'Mumbai \u2192 Goa',
    paidBy: 'Arjun',
    isGroupExpense: true,
    splitType: SplitType.equal,
  ),
  Expense(
    id: '3',
    amount: 4800,
    currency: 'INR',
    category: ExpenseCategory.accommodation,
    merchant: 'Beach Shack Resort',
    date: DateTime(2026, 3, 7),
    tripId: 'trip1',
    tripName: 'Mumbai \u2192 Goa',
    paidBy: 'Priya',
    isGroupExpense: true,
    splitType: SplitType.equal,
  ),
  Expense(
    id: '4',
    amount: 800,
    currency: 'INR',
    category: ExpenseCategory.activity,
    merchant: 'Dolphin Watching Tour',
    date: DateTime(2026, 3, 8),
    tripId: 'trip1',
    tripName: 'Mumbai \u2192 Goa',
  ),
  Expense(
    id: '5',
    amount: 2200,
    currency: 'INR',
    category: ExpenseCategory.shopping,
    merchant: 'Mapusa Friday Market',
    date: DateTime(2026, 3, 9),
    tripId: 'trip1',
    tripName: 'Mumbai \u2192 Goa',
  ),
  Expense(
    id: '6',
    amount: 950,
    currency: 'INR',
    category: ExpenseCategory.food,
    merchant: 'Britto\'s - Baga',
    date: DateTime(2026, 3, 9),
    tripId: 'trip1',
    tripName: 'Mumbai \u2192 Goa',
    paidBy: 'Ravi',
    isGroupExpense: true,
    splitType: SplitType.custom,
    customSplit: {'You': 300, 'Ravi': 350, 'Arjun': 300},
  ),
  Expense(
    id: '7',
    amount: 1500,
    currency: 'INR',
    category: ExpenseCategory.food,
    merchant: 'Highway Dhaba',
    date: DateTime(2026, 2, 28),
    tripId: 'trip2',
    tripName: 'Delhi \u2192 Jaipur',
  ),
  Expense(
    id: '8',
    amount: 6000,
    currency: 'INR',
    category: ExpenseCategory.accommodation,
    merchant: 'Haveli Heritage Stay',
    date: DateTime(2026, 2, 28),
    tripId: 'trip2',
    tripName: 'Delhi \u2192 Jaipur',
  ),
];

// ---------------------------------------------------------------------------
// MAIN SCREEN
// ---------------------------------------------------------------------------

class ExpensesScreen extends ConsumerStatefulWidget {
  const ExpensesScreen({super.key});

  @override
  ConsumerState<ExpensesScreen> createState() => _ExpensesScreenState();
}

class _ExpensesScreenState extends ConsumerState<ExpensesScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Expenses'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () => _showFilterSheet(context),
          ),
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'pdf') _exportExpenses('pdf');
              if (value == 'csv') _exportExpenses('csv');
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'pdf',
                child: Row(
                  children: [
                    Icon(Icons.picture_as_pdf, size: 20),
                    SizedBox(width: 8),
                    Text('Export as PDF'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'csv',
                child: Row(
                  children: [
                    Icon(Icons.table_chart, size: 20),
                    SizedBox(width: 8),
                    Text('Export as CSV'),
                  ],
                ),
              ),
            ],
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabAlignment: TabAlignment.start,
          labelColor: AppColors.accent,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.accent,
          tabs: const [
            Tab(text: 'All Expenses'),
            Tab(text: 'Group Ledger'),
            Tab(text: 'Summary'),
            Tab(text: 'Settle Up'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _AllExpensesTab(),
          _GroupLedgerTab(),
          _SummaryTab(),
          _SettleUpTab(),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showQuickAddSheet(context),
        icon: const Icon(Icons.add),
        label: const Text('Add Expense'),
        backgroundColor: AppColors.accent,
        foregroundColor: AppColors.white,
      ),
    );
  }

  // -------------------------------------------------------------------------
  // FILTER BOTTOM SHEET
  // -------------------------------------------------------------------------

  void _showFilterSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => _FilterSheet(ref: ref),
    );
  }

  // -------------------------------------------------------------------------
  // QUICK ADD BOTTOM SHEET
  // -------------------------------------------------------------------------

  void _showQuickAddSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => _QuickAddExpenseSheet(
        onSave: (expense) {
          ref.read(expensesProvider.notifier).addExpense(expense);
          Navigator.pop(ctx);
        },
      ),
    );
  }

  // -------------------------------------------------------------------------
  // EXPORT
  // -------------------------------------------------------------------------

  void _exportExpenses(String format) {
    final expenses = ref.read(filteredExpensesProvider);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Exporting ${expenses.length} expenses as ${format.toUpperCase()}...',
        ),
        behavior: SnackBarBehavior.floating,
        action: SnackBarAction(
          label: 'OK',
          onPressed: () {},
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// TAB 1: ALL EXPENSES LIST
// ---------------------------------------------------------------------------

class _AllExpensesTab extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final expenses = ref.watch(filteredExpensesProvider);
    final tripFilter = ref.watch(selectedTripFilterProvider);
    final categoryFilter = ref.watch(selectedCategoryFilterProvider);
    final dateRange = ref.watch(dateRangeFilterProvider);

    final hasFilters =
        tripFilter != null || categoryFilter != null || dateRange != null;

    if (expenses.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.receipt_long, size: 64, color: AppColors.textTertiary),
            const SizedBox(height: 16),
            Text(
              hasFilters ? 'No expenses match filters' : 'No expenses yet',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 16),
            ),
            if (hasFilters) ...[
              const SizedBox(height: 8),
              TextButton(
                onPressed: () {
                  ref.read(selectedTripFilterProvider.notifier).state = null;
                  ref.read(selectedCategoryFilterProvider.notifier).state = null;
                  ref.read(dateRangeFilterProvider.notifier).state = null;
                },
                child: const Text('Clear filters'),
              ),
            ],
          ],
        ),
      );
    }

    // Group by date
    final grouped = <String, List<Expense>>{};
    for (final e in expenses) {
      final key = _formatDateHeader(e.date);
      grouped.putIfAbsent(key, () => []).add(e);
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 100),
      itemCount: grouped.length,
      itemBuilder: (context, index) {
        final dateKey = grouped.keys.elementAt(index);
        final items = grouped[dateKey]!;
        final dayTotal = items.fold<double>(0, (sum, e) => sum + e.amount);

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    dateKey,
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  Text(
                    '\u20B9${dayTotal.toStringAsFixed(0)}',
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            ...items.map((e) => _ExpenseCard(expense: e)),
          ],
        );
      },
    );
  }
}

class _ExpenseCard extends StatelessWidget {
  final Expense expense;
  const _ExpenseCard({required this.expense});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () => _showExpenseDetail(context),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: expense.category.color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  expense.category.icon,
                  color: expense.category.color,
                  size: 22,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      expense.merchant,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color:
                                expense.category.color.withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            expense.category.label,
                            style: TextStyle(
                              fontSize: 11,
                              color: expense.category.color,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        if (expense.isGroupExpense) ...[
                          const SizedBox(width: 6),
                          Icon(Icons.group, size: 12, color: AppColors.info),
                          const SizedBox(width: 2),
                          Text(
                            expense.paidBy ?? '',
                            style: TextStyle(
                              fontSize: 11,
                              color: AppColors.textTertiary,
                            ),
                          ),
                        ],
                        const SizedBox(width: 6),
                        Icon(Icons.directions_car,
                            size: 12, color: AppColors.textTertiary),
                        const SizedBox(width: 2),
                        Flexible(
                          child: Text(
                            expense.tripName,
                            style: TextStyle(
                              fontSize: 11,
                              color: AppColors.textTertiary,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    '\u20B9${expense.amount.toStringAsFixed(0)}',
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 16,
                      color: AppColors.primary,
                    ),
                  ),
                  Text(
                    _formatShortDate(expense.date),
                    style: TextStyle(
                      fontSize: 11,
                      color: AppColors.textTertiary,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showExpenseDetail(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: expense.category.color.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(expense.category.icon,
                      color: expense.category.color, size: 24),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(expense.merchant,
                          style: const TextStyle(
                              fontWeight: FontWeight.w700, fontSize: 18)),
                      Text(expense.category.label,
                          style: TextStyle(color: AppColors.textSecondary)),
                    ],
                  ),
                ),
                Text(
                  '\u20B9${expense.amount.toStringAsFixed(0)}',
                  style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 22,
                      color: AppColors.accent),
                ),
              ],
            ),
            const SizedBox(height: 20),
            _detailRow(Icons.calendar_today, 'Date', _formatFullDate(expense.date)),
            _detailRow(Icons.directions_car, 'Trip', expense.tripName),
            _detailRow(Icons.currency_rupee, 'Currency', expense.currency),
            if (expense.isGroupExpense) ...[
              _detailRow(Icons.person, 'Paid by', expense.paidBy ?? 'Unknown'),
              _detailRow(
                Icons.call_split,
                'Split',
                expense.splitType == SplitType.equal ? 'Equal' : 'Custom',
              ),
              if (expense.customSplit != null) ...[
                const SizedBox(height: 8),
                ...expense.customSplit!.entries.map((entry) => Padding(
                      padding: const EdgeInsets.only(left: 40, bottom: 4),
                      child: Text(
                        '${entry.key}: \u20B9${entry.value.toStringAsFixed(0)}',
                        style: TextStyle(
                          fontSize: 13,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    )),
              ],
            ],
            if (expense.receiptUrl != null)
              _detailRow(Icons.receipt, 'Receipt', 'Attached'),
            if (expense.ocrText != null) ...[
              const SizedBox(height: 12),
              Text('OCR Result',
                  style: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                      fontSize: 13)),
              const SizedBox(height: 4),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.surfaceVariant,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(expense.ocrText!,
                    style: const TextStyle(fontSize: 13)),
              ),
            ],
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _detailRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Icon(icon, size: 18, color: AppColors.textTertiary),
          const SizedBox(width: 12),
          Text(label,
              style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
          const Spacer(),
          Text(value,
              style:
                  const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// TAB 2: GROUP EXPENSE LEDGER
// ---------------------------------------------------------------------------

class _GroupLedgerTab extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final expenses = ref.watch(filteredExpensesProvider);
    final groupExpenses = expenses.where((e) => e.isGroupExpense).toList();

    if (groupExpenses.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.group_off, size: 64, color: AppColors.textTertiary),
            const SizedBox(height: 16),
            Text(
              'No shared expenses',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 16),
            ),
          ],
        ),
      );
    }

    // Calculate totals per person
    final paidByTotals = <String, double>{};
    for (final e in groupExpenses) {
      final payer = e.paidBy ?? 'Unknown';
      paidByTotals[payer] = (paidByTotals[payer] ?? 0) + e.amount;
    }
    final grandTotal =
        groupExpenses.fold<double>(0, (sum, e) => sum + e.amount);

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 100),
      children: [
        // Summary card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppColors.primary, AppColors.primaryLight],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Group Total',
                style: TextStyle(color: Colors.white70, fontSize: 13),
              ),
              const SizedBox(height: 4),
              Text(
                '\u20B9${grandTotal.toStringAsFixed(0)}',
                style: const TextStyle(
                  color: AppColors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 12,
                runSpacing: 8,
                children: paidByTotals.entries.map((entry) {
                  return Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.white.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '${entry.key}: \u20B9${entry.value.toStringAsFixed(0)}',
                      style: const TextStyle(
                        color: AppColors.white,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        Text(
          'Shared Expenses',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
        ),
        const SizedBox(height: 12),

        ...groupExpenses.map((e) => Card(
              margin: const EdgeInsets.only(bottom: 10),
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: e.category.color.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child:
                          Icon(e.category.icon, color: e.category.color, size: 20),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(e.merchant,
                              style: const TextStyle(
                                  fontWeight: FontWeight.w600, fontSize: 14)),
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              Icon(Icons.person,
                                  size: 12, color: AppColors.textTertiary),
                              const SizedBox(width: 3),
                              Text(
                                'Paid by ${e.paidBy}',
                                style: TextStyle(
                                    fontSize: 12,
                                    color: AppColors.textSecondary),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 5, vertical: 1),
                                decoration: BoxDecoration(
                                  color: AppColors.info.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  e.splitType == SplitType.equal
                                      ? 'Equal'
                                      : 'Custom',
                                  style: const TextStyle(
                                      fontSize: 10,
                                      color: AppColors.info,
                                      fontWeight: FontWeight.w600),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '\u20B9${e.amount.toStringAsFixed(0)}',
                      style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 15,
                          color: AppColors.primary),
                    ),
                  ],
                ),
              ),
            )),
      ],
    );
  }
}

// ---------------------------------------------------------------------------
// TAB 3: TRIP FINANCE SUMMARY
// ---------------------------------------------------------------------------

class _SummaryTab extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final expenses = ref.watch(filteredExpensesProvider);
    final budget = ref.watch(tripBudgetProvider);

    final totalSpent = expenses.fold<double>(0, (sum, e) => sum + e.amount);

    // Per-category totals
    final categoryTotals = <ExpenseCategory, double>{};
    for (final e in expenses) {
      categoryTotals[e.category] =
          (categoryTotals[e.category] ?? 0) + e.amount;
    }

    final budgetPercent =
        budget.totalBudget > 0 ? (totalSpent / budget.totalBudget) : 0.0;

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
      children: [
        // Total Spent Card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: budgetPercent > 1.0
                  ? [AppColors.error, AppColors.error.withValues(alpha: 0.8)]
                  : [AppColors.primary, AppColors.primaryLight],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Total Spent',
                style: TextStyle(color: Colors.white70, fontSize: 13),
              ),
              const SizedBox(height: 4),
              Text(
                '\u20B9${totalSpent.toStringAsFixed(0)}',
                style: const TextStyle(
                  color: AppColors.white,
                  fontSize: 32,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Text(
                    'of \u20B9${budget.totalBudget.toStringAsFixed(0)} budget',
                    style: const TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                  const Spacer(),
                  Text(
                    '${(budgetPercent * 100).toStringAsFixed(0)}%',
                    style: const TextStyle(
                      color: AppColors.white,
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: budgetPercent.clamp(0.0, 1.0),
                  minHeight: 6,
                  backgroundColor: AppColors.white.withValues(alpha: 0.2),
                  valueColor: AlwaysStoppedAnimation<Color>(
                    budgetPercent > 0.9
                        ? AppColors.warning
                        : AppColors.white.withValues(alpha: 0.9),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Pie Chart
        Text(
          'Spending by Category',
          style: Theme.of(context)
              .textTheme
              .titleMedium
              ?.copyWith(fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 16),
        if (categoryTotals.isNotEmpty)
          SizedBox(
            height: 200,
            child: PieChart(
              PieChartData(
                sectionsSpace: 2,
                centerSpaceRadius: 40,
                sections: categoryTotals.entries.map((entry) {
                  final percentage = totalSpent > 0
                      ? (entry.value / totalSpent * 100)
                      : 0.0;
                  return PieChartSectionData(
                    color: entry.key.color,
                    value: entry.value,
                    title: '${percentage.toStringAsFixed(0)}%',
                    titleStyle: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppColors.white,
                    ),
                    radius: 50,
                  );
                }).toList(),
              ),
            ),
          ),
        const SizedBox(height: 16),

        // Category legend + breakdown
        ...ExpenseCategory.values.map((cat) {
          final spent = categoryTotals[cat] ?? 0;
          final budgetAmt = budget.categoryBudgets[cat] ?? 0;
          final catPercent = budgetAmt > 0 ? (spent / budgetAmt) : 0.0;

          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: cat.color,
                        borderRadius: BorderRadius.circular(3),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Icon(cat.icon, size: 16, color: cat.color),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        cat.label,
                        style: const TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 14),
                      ),
                    ),
                    Text(
                      '\u20B9${spent.toStringAsFixed(0)}',
                      style: const TextStyle(
                          fontWeight: FontWeight.w700, fontSize: 14),
                    ),
                    Text(
                      ' / \u20B9${budgetAmt.toStringAsFixed(0)}',
                      style: TextStyle(
                          color: AppColors.textTertiary, fontSize: 12),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                ClipRRect(
                  borderRadius: BorderRadius.circular(3),
                  child: LinearProgressIndicator(
                    value: catPercent.clamp(0.0, 1.0),
                    minHeight: 4,
                    backgroundColor: AppColors.surfaceVariant,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      catPercent > 1.0 ? AppColors.error : cat.color,
                    ),
                  ),
                ),
              ],
            ),
          );
        }),

        const SizedBox(height: 24),

        // Budget vs Actual comparison
        Text(
          'Budget vs Actual',
          style: Theme.of(context)
              .textTheme
              .titleMedium
              ?.copyWith(fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 200,
          child: BarChart(
            BarChartData(
              alignment: BarChartAlignment.spaceAround,
              maxY: budget.categoryBudgets.values.fold<double>(
                      0, (a, b) => a > b ? a : b) *
                  1.3,
              barTouchData: BarTouchData(enabled: false),
              titlesData: FlTitlesData(
                show: true,
                topTitles:
                    const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                rightTitles:
                    const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                leftTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: true,
                    reservedSize: 42,
                    getTitlesWidget: (value, meta) {
                      if (value == 0) return const SizedBox.shrink();
                      return Text(
                        '${(value / 1000).toStringAsFixed(0)}k',
                        style: TextStyle(
                            fontSize: 10, color: AppColors.textTertiary),
                      );
                    },
                  ),
                ),
                bottomTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: true,
                    getTitlesWidget: (value, meta) {
                      final cats = ExpenseCategory.values;
                      if (value.toInt() >= cats.length) {
                        return const SizedBox.shrink();
                      }
                      return Padding(
                        padding: const EdgeInsets.only(top: 6),
                        child: Icon(cats[value.toInt()].icon,
                            size: 16, color: cats[value.toInt()].color),
                      );
                    },
                  ),
                ),
              ),
              gridData: FlGridData(
                show: true,
                drawVerticalLine: false,
                horizontalInterval: 5000,
                getDrawingHorizontalLine: (value) => FlLine(
                  color: AppColors.border,
                  strokeWidth: 1,
                ),
              ),
              borderData: FlBorderData(show: false),
              barGroups: List.generate(ExpenseCategory.values.length, (i) {
                final cat = ExpenseCategory.values[i];
                final budgetVal = budget.categoryBudgets[cat] ?? 0;
                final actualVal = categoryTotals[cat] ?? 0;
                return BarChartGroupData(
                  x: i,
                  barRods: [
                    BarChartRodData(
                      toY: budgetVal,
                      color: AppColors.border,
                      width: 10,
                      borderRadius: BorderRadius.circular(3),
                    ),
                    BarChartRodData(
                      toY: actualVal,
                      color: cat.color,
                      width: 10,
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ],
                );
              }),
            ),
          ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _legendDot(AppColors.border, 'Budget'),
            const SizedBox(width: 20),
            _legendDot(AppColors.accent, 'Actual'),
          ],
        ),
      ],
    );
  }

  Widget _legendDot(Color color, String label) {
    return Row(
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 6),
        Text(label,
            style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
      ],
    );
  }
}

// ---------------------------------------------------------------------------
// TAB 4: DEBT SETTLEMENT
// ---------------------------------------------------------------------------

class _SettleUpTab extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final debts = ref.watch(debtsProvider);

    // Calculate net balances
    final balances = <String, double>{};
    for (final d in debts) {
      balances[d.from] = (balances[d.from] ?? 0) - d.amount;
      balances[d.to] = (balances[d.to] ?? 0) + d.amount;
    }

    // Minimum transactions to settle
    final settlements = _computeMinSettlements(balances);

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
      children: [
        // Net balances
        Text(
          'Net Balances',
          style: Theme.of(context)
              .textTheme
              .titleMedium
              ?.copyWith(fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 12),
        ...balances.entries.map((entry) {
          final isPositive = entry.value >= 0;
          return Card(
            margin: const EdgeInsets.only(bottom: 8),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: isPositive
                    ? AppColors.success.withValues(alpha: 0.12)
                    : AppColors.error.withValues(alpha: 0.12),
                child: Icon(
                  isPositive ? Icons.arrow_downward : Icons.arrow_upward,
                  color: isPositive ? AppColors.success : AppColors.error,
                  size: 20,
                ),
              ),
              title: Text(entry.key,
                  style: const TextStyle(fontWeight: FontWeight.w600)),
              subtitle: Text(
                isPositive ? 'Gets back money' : 'Owes money',
                style:
                    TextStyle(fontSize: 12, color: AppColors.textSecondary),
              ),
              trailing: Text(
                '${isPositive ? '+' : ''}\u20B9${entry.value.toStringAsFixed(0)}',
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 16,
                  color: isPositive ? AppColors.success : AppColors.error,
                ),
              ),
            ),
          );
        }),

        const SizedBox(height: 24),

        // Minimum settlements
        Text(
          'Minimum Settlements',
          style: Theme.of(context)
              .textTheme
              .titleMedium
              ?.copyWith(fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 4),
        Text(
          '${settlements.length} transaction${settlements.length == 1 ? '' : 's'} to settle all debts',
          style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
        ),
        const SizedBox(height: 12),

        ...settlements.map((s) => Card(
              margin: const EdgeInsets.only(bottom: 10),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                s.from,
                                style: const TextStyle(
                                    fontWeight: FontWeight.w700, fontSize: 15),
                              ),
                              Padding(
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 8),
                                child: Icon(Icons.arrow_forward,
                                    size: 16, color: AppColors.accent),
                              ),
                              Text(
                                s.to,
                                style: const TextStyle(
                                    fontWeight: FontWeight.w700, fontSize: 15),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'pays',
                            style: TextStyle(
                                fontSize: 12,
                                color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '\u20B9${s.amount.toStringAsFixed(0)}',
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        fontSize: 18,
                        color: AppColors.accent,
                      ),
                    ),
                  ],
                ),
              ),
            )),

        const SizedBox(height: 24),

        // Settle button
        FilledButton.icon(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Settlement reminders sent!'),
                behavior: SnackBarBehavior.floating,
              ),
            );
          },
          icon: const Icon(Icons.check_circle_outline),
          label: const Text('Send Settlement Reminders'),
          style: FilledButton.styleFrom(
            backgroundColor: AppColors.success,
            minimumSize: const Size.fromHeight(48),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ],
    );
  }

  /// Greedy algorithm: repeatedly settle the max creditor with the max debtor.
  List<DebtEntry> _computeMinSettlements(Map<String, double> balances) {
    final settlements = <DebtEntry>[];
    final entries = balances.entries
        .map((e) => MapEntry(e.key, e.value))
        .toList();

    // Separate into creditors (+) and debtors (-)
    while (true) {
      entries.sort((a, b) => a.value.compareTo(b.value));
      final debtor = entries.first;
      final creditor = entries.last;

      if (debtor.value.abs() < 1 && creditor.value.abs() < 1) break;
      if (debtor.value >= 0) break; // no more debtors

      final amount = min(creditor.value, debtor.value.abs());
      if (amount < 1) break;

      settlements.add(DebtEntry(
        from: debtor.key,
        to: creditor.key,
        amount: amount,
        currency: 'INR',
      ));

      final di = entries.indexWhere((e) => e.key == debtor.key);
      final ci = entries.indexWhere((e) => e.key == creditor.key);
      entries[di] = MapEntry(debtor.key, debtor.value + amount);
      entries[ci] = MapEntry(creditor.key, creditor.value - amount);
    }

    return settlements;
  }
}

// ---------------------------------------------------------------------------
// QUICK-ADD EXPENSE SHEET
// ---------------------------------------------------------------------------

class _QuickAddExpenseSheet extends StatefulWidget {
  final ValueChanged<Expense> onSave;
  const _QuickAddExpenseSheet({required this.onSave});

  @override
  State<_QuickAddExpenseSheet> createState() => _QuickAddExpenseSheetState();
}

class _QuickAddExpenseSheetState extends State<_QuickAddExpenseSheet> {
  final _amountController = TextEditingController();
  final _merchantController = TextEditingController();
  ExpenseCategory _category = ExpenseCategory.food;
  String _currency = 'INR';
  bool _isGroupExpense = false;
  SplitType _splitType = SplitType.equal;
  String _paidBy = 'You';
  String? _ocrResultText;

  final _currencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'THB'];
  final _members = ['You', 'Arjun', 'Priya', 'Ravi'];

  @override
  void dispose() {
    _amountController.dispose();
    _merchantController.dispose();
    super.dispose();
  }

  void _simulateReceiptScan() {
    setState(() {
      _ocrResultText =
          'Konkan Rasoi\nFish Thali x2  \u20B9600\nSol Kadhi        \u20B9120\nTotal: \u20B91320\nDate: 08-Mar-2026';
      _amountController.text = '1320';
      _merchantController.text = 'Konkan Rasoi';
      _category = ExpenseCategory.food;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(
          24, 24, 24, MediaQuery.of(context).viewInsets.bottom + 24),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Add Expense',
                  style: Theme.of(context)
                      .textTheme
                      .titleLarge
                      ?.copyWith(fontWeight: FontWeight.w700),
                ),
                // Receipt scanner
                OutlinedButton.icon(
                  onPressed: _simulateReceiptScan,
                  icon: const Icon(Icons.camera_alt, size: 18),
                  label: const Text('Scan Receipt'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.accent,
                    side: const BorderSide(color: AppColors.accent),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // OCR Result
            if (_ocrResultText != null) ...[
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.success.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                      color: AppColors.success.withValues(alpha: 0.3)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.document_scanner,
                            size: 16, color: AppColors.success),
                        const SizedBox(width: 6),
                        const Text(
                          'OCR Result',
                          style: TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 13,
                              color: AppColors.success),
                        ),
                        const Spacer(),
                        InkWell(
                          onTap: () => setState(() => _ocrResultText = null),
                          child: Icon(Icons.close,
                              size: 16, color: AppColors.textTertiary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _ocrResultText!,
                      style: const TextStyle(fontSize: 12, height: 1.5),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],

            // Amount + Currency row
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  flex: 3,
                  child: TextField(
                    controller: _amountController,
                    keyboardType:
                        const TextInputType.numberWithOptions(decimal: true),
                    style: const TextStyle(
                        fontSize: 24, fontWeight: FontWeight.w700),
                    decoration: InputDecoration(
                      labelText: 'Amount',
                      prefixText: _currencySymbol(_currency),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  flex: 2,
                  child: DropdownButtonFormField<String>(
                    value: _currency,
                    decoration: InputDecoration(
                      labelText: 'Currency',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 16),
                    ),
                    items: _currencies
                        .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                        .toList(),
                    onChanged: (v) => setState(() => _currency = v ?? 'INR'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Merchant
            TextField(
              controller: _merchantController,
              decoration: InputDecoration(
                labelText: 'Merchant / Description',
                prefixIcon: const Icon(Icons.store),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Category selector
            Text('Category',
                style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                    color: AppColors.textSecondary)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: ExpenseCategory.values.map((cat) {
                final isSelected = _category == cat;
                return ChoiceChip(
                  selected: isSelected,
                  onSelected: (_) => setState(() => _category = cat),
                  avatar: Icon(cat.icon,
                      size: 16,
                      color: isSelected ? AppColors.white : cat.color),
                  label: Text(cat.label),
                  selectedColor: cat.color,
                  labelStyle: TextStyle(
                    color: isSelected ? AppColors.white : AppColors.textPrimary,
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 16),

            // Group expense toggle
            SwitchListTile(
              value: _isGroupExpense,
              onChanged: (v) => setState(() => _isGroupExpense = v),
              title: const Text('Shared / Group Expense',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
              subtitle: const Text('Split with travel partners'),
              contentPadding: EdgeInsets.zero,
              activeColor: AppColors.accent,
            ),

            if (_isGroupExpense) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _paidBy,
                      decoration: InputDecoration(
                        labelText: 'Paid by',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 14),
                      ),
                      items: _members
                          .map((m) =>
                              DropdownMenuItem(value: m, child: Text(m)))
                          .toList(),
                      onChanged: (v) =>
                          setState(() => _paidBy = v ?? 'You'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: DropdownButtonFormField<SplitType>(
                      value: _splitType,
                      decoration: InputDecoration(
                        labelText: 'Split type',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 14),
                      ),
                      items: SplitType.values
                          .map((s) => DropdownMenuItem(
                              value: s,
                              child: Text(
                                  s == SplitType.equal ? 'Equal' : 'Custom')))
                          .toList(),
                      onChanged: (v) =>
                          setState(() => _splitType = v ?? SplitType.equal),
                    ),
                  ),
                ],
              ),
            ],
            const SizedBox(height: 24),

            // Save button
            FilledButton.icon(
              onPressed: () {
                final amount =
                    double.tryParse(_amountController.text) ?? 0;
                if (amount <= 0) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Please enter a valid amount'),
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                  return;
                }
                final expense = Expense(
                  id: DateTime.now().millisecondsSinceEpoch.toString(),
                  amount: amount,
                  currency: _currency,
                  category: _category,
                  merchant: _merchantController.text.isNotEmpty
                      ? _merchantController.text
                      : _category.label,
                  date: DateTime.now(),
                  tripId: 'trip1',
                  tripName: 'Mumbai \u2192 Goa',
                  isGroupExpense: _isGroupExpense,
                  paidBy: _isGroupExpense ? _paidBy : null,
                  splitType: _isGroupExpense ? _splitType : null,
                  ocrText: _ocrResultText,
                );
                widget.onSave(expense);
              },
              icon: const Icon(Icons.check),
              label: const Text('Save Expense'),
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.accent,
                minimumSize: const Size.fromHeight(48),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _currencySymbol(String code) {
    switch (code) {
      case 'INR':
        return '\u20B9 ';
      case 'USD':
        return '\$ ';
      case 'EUR':
        return '\u20AC ';
      case 'GBP':
        return '\u00A3 ';
      case 'JPY':
        return '\u00A5 ';
      case 'THB':
        return '\u0E3F ';
      default:
        return '';
    }
  }
}

// ---------------------------------------------------------------------------
// FILTER SHEET
// ---------------------------------------------------------------------------

class _FilterSheet extends StatelessWidget {
  final WidgetRef ref;
  const _FilterSheet({required this.ref});

  @override
  Widget build(BuildContext context) {
    final tripFilter = ref.watch(selectedTripFilterProvider);
    final categoryFilter = ref.watch(selectedCategoryFilterProvider);
    final dateRange = ref.watch(dateRangeFilterProvider);

    final trips = [
      {'id': 'trip1', 'name': 'Mumbai \u2192 Goa'},
      {'id': 'trip2', 'name': 'Delhi \u2192 Jaipur'},
    ];

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Filter Expenses',
                style: Theme.of(context)
                    .textTheme
                    .titleLarge
                    ?.copyWith(fontWeight: FontWeight.w700),
              ),
              TextButton(
                onPressed: () {
                  ref.read(selectedTripFilterProvider.notifier).state = null;
                  ref.read(selectedCategoryFilterProvider.notifier).state = null;
                  ref.read(dateRangeFilterProvider.notifier).state = null;
                },
                child: const Text('Clear All'),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Trip filter
          Text('Trip',
              style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                  color: AppColors.textSecondary)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ChoiceChip(
                selected: tripFilter == null,
                onSelected: (_) =>
                    ref.read(selectedTripFilterProvider.notifier).state = null,
                label: const Text('All Trips'),
                selectedColor: AppColors.primary.withValues(alpha: 0.12),
              ),
              ...trips.map((t) => ChoiceChip(
                    selected: tripFilter == t['id'],
                    onSelected: (_) => ref
                        .read(selectedTripFilterProvider.notifier)
                        .state = t['id'],
                    label: Text(t['name']!),
                    selectedColor: AppColors.primary.withValues(alpha: 0.12),
                  )),
            ],
          ),
          const SizedBox(height: 16),

          // Category filter
          Text('Category',
              style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                  color: AppColors.textSecondary)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ChoiceChip(
                selected: categoryFilter == null,
                onSelected: (_) => ref
                    .read(selectedCategoryFilterProvider.notifier)
                    .state = null,
                label: const Text('All'),
                selectedColor: AppColors.primary.withValues(alpha: 0.12),
              ),
              ...ExpenseCategory.values.map((cat) => ChoiceChip(
                    selected: categoryFilter == cat,
                    onSelected: (_) => ref
                        .read(selectedCategoryFilterProvider.notifier)
                        .state = cat,
                    avatar: Icon(cat.icon, size: 16, color: cat.color),
                    label: Text(cat.label),
                    selectedColor: cat.color.withValues(alpha: 0.15),
                  )),
            ],
          ),
          const SizedBox(height: 16),

          // Date range
          Text('Date Range',
              style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                  color: AppColors.textSecondary)),
          const SizedBox(height: 8),
          OutlinedButton.icon(
            onPressed: () async {
              final picked = await showDateRangePicker(
                context: context,
                firstDate: DateTime(2025),
                lastDate: DateTime(2027),
                initialDateRange: dateRange,
                builder: (context, child) {
                  return Theme(
                    data: Theme.of(context).copyWith(
                      colorScheme: Theme.of(context).colorScheme.copyWith(
                            primary: AppColors.primary,
                          ),
                    ),
                    child: child!,
                  );
                },
              );
              if (picked != null) {
                ref.read(dateRangeFilterProvider.notifier).state = picked;
              }
            },
            icon: const Icon(Icons.calendar_month, size: 18),
            label: Text(
              dateRange != null
                  ? '${_formatShortDate(dateRange.start)} - ${_formatShortDate(dateRange.end)}'
                  : 'Select date range',
            ),
            style: OutlinedButton.styleFrom(
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10)),
            ),
          ),
          const SizedBox(height: 24),

          FilledButton(
            onPressed: () => Navigator.pop(context),
            style: FilledButton.styleFrom(
              backgroundColor: AppColors.primary,
              minimumSize: const Size.fromHeight(48),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('Apply Filters'),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// UTILITIES
// ---------------------------------------------------------------------------

String _formatDateHeader(DateTime date) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return '${months[date.month - 1]} ${date.day}, ${date.year}';
}

String _formatShortDate(DateTime date) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return '${date.day} ${months[date.month - 1]}';
}

String _formatFullDate(DateTime date) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return '${date.day} ${months[date.month - 1]} ${date.year}';
}
