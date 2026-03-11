import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../widgets/trip_card.dart';

class TripsScreen extends ConsumerStatefulWidget {
  const TripsScreen({super.key});

  @override
  ConsumerState<TripsScreen> createState() => _TripsScreenState();
}

class _TripsScreenState extends ConsumerState<TripsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> _trips = [
    {
      'id': '1',
      'from': 'Mumbai',
      'to': 'Goa',
      'date': 'Mar 5 - Mar 8, 2026',
      'distance': '580 km',
      'status': 'completed',
      'type': 'road',
    },
    {
      'id': '2',
      'from': 'Delhi',
      'to': 'Jaipur',
      'date': 'Feb 28, 2026',
      'distance': '280 km',
      'status': 'completed',
      'type': 'road',
    },
    {
      'id': '3',
      'from': 'Bangalore',
      'to': 'Ooty',
      'date': 'Feb 20, 2026',
      'distance': '270 km',
      'status': 'completed',
      'type': 'road',
    },
    {
      'id': '4',
      'from': 'Chennai',
      'to': 'Pondicherry',
      'date': 'Mar 15, 2026',
      'distance': '150 km',
      'status': 'upcoming',
      'type': 'road',
    },
    {
      'id': '5',
      'from': 'Hyderabad',
      'to': 'Hampi',
      'date': 'Mar 22, 2026',
      'distance': '370 km',
      'status': 'upcoming',
      'type': 'road',
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> _getFilteredTrips(int tabIndex) {
    switch (tabIndex) {
      case 1:
        return _trips.where((t) => t['status'] == 'upcoming').toList();
      case 2:
        return _trips.where((t) => t['status'] == 'completed').toList();
      default:
        return _trips;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Trips'),
        bottom: TabBar(
          controller: _tabController,
          onTap: (_) => setState(() {}),
          tabs: const [
            Tab(text: 'All'),
            Tab(text: 'Upcoming'),
            Tab(text: 'Completed'),
          ],
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.accent,
          indicatorWeight: 3,
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: List.generate(3, (tabIndex) {
          final filtered = _getFilteredTrips(tabIndex);
          if (filtered.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.luggage_rounded,
                      size: 64, color: AppColors.textTertiary),
                  const SizedBox(height: 16),
                  Text(
                    'No trips yet',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: AppColors.textSecondary,
                        ),
                  ),
                  const SizedBox(height: 8),
                  ElevatedButton(
                    onPressed: () => context.push('/trips/new'),
                    child: const Text('Plan a Trip'),
                  ),
                ],
              ),
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: filtered.length,
            itemBuilder: (context, index) {
              return TripCard(
                trip: filtered[index],
                onTap: () => context.push('/trips/${filtered[index]['id']}'),
              );
            },
          );
        }),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/trips/new'),
        child: const Icon(Icons.add_rounded),
      ),
    );
  }
}
