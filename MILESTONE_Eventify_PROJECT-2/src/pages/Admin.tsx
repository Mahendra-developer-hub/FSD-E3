import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: '#1e2e22',
        backgroundColor: 'rgba(30, 46, 34, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: ['Tech', 'Music', 'Business', 'Arts', 'Sports'],
    datasets: [
      {
        label: 'Tickets Sold',
        data: [65, 59, 80, 81, 56],
        backgroundColor: '#1e2e22',
      },
    ],
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">Admin Dashboard</h1>
          <p className="text-[13px] text-stone-500">Manage events, view analytics, and track bookings.</p>
        </div>
        <button className="bg-[#1e2e22] text-white font-bold py-3 px-6 rounded-md hover:bg-black transition-colors duration-300 text-[11px] tracking-widest uppercase">
          + Create New Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
          <h3 className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-4">Total Revenue</h3>
          <p className="text-4xl font-serif font-bold text-stone-900">₹1,23,000</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
          <h3 className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-4">Total Bookings</h3>
          <p className="text-4xl font-serif font-bold text-stone-900">1,245</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
          <h3 className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-4">Active Events</h3>
          <p className="text-4xl font-serif font-bold text-stone-900">{events.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
          <h3 className="text-xl font-serif font-bold mb-6 text-stone-900">Revenue Trend</h3>
          <Line data={lineChartData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
          <h3 className="text-xl font-serif font-bold mb-6 text-stone-900">Sales by Category</h3>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-serif font-bold text-stone-900">Recent Events</h3>
          <input 
            type="text" 
            placeholder="Search events..." 
            className="bg-[#f8f9fa] border-none rounded-none border-b-2 border-stone-200 px-4 py-2 outline-none transition-all font-medium text-[13px] focus:border-[#1e2e22] focus:bg-white w-64"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-100">
                <th className="py-4 px-4 font-bold text-[10px] tracking-widest uppercase text-stone-400">Event Title</th>
                <th className="py-4 px-4 font-bold text-[10px] tracking-widest uppercase text-stone-400">Date</th>
                <th className="py-4 px-4 font-bold text-[10px] tracking-widest uppercase text-stone-400">Category</th>
                <th className="py-4 px-4 font-bold text-[10px] tracking-widest uppercase text-stone-400">Status</th>
                <th className="py-4 px-4 font-bold text-[10px] tracking-widest uppercase text-stone-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event: any) => (
                <tr key={event._id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-4 font-serif text-[15px] text-stone-900">{event.title}</td>
                  <td className="py-4 px-4 text-[13px] text-stone-500">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">{event.category}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Active</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-[11px] font-bold text-stone-500 hover:text-stone-800 uppercase tracking-widest transition-colors">Edit</button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[13px] text-stone-500 font-serif italic">No events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
