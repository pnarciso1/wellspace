'use client'

import React from 'react'
// Note: There's a known type incompatibility between recharts and Next.js
// The components work correctly at runtime, but TypeScript shows errors
// @see https://github.com/recharts/recharts/issues/3615
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer
} from 'recharts'
import type { FrequencyType, TreatmentType } from '../types'

interface ChartData {
  date: string;
  intensity: number;
  frequency: FrequencyType;
  treatments: TreatmentType[];
}

interface ChartWrapperProps {
  type: 'symptom' | 'treatment' | 'qol';
  data: any;
}

export default function ChartWrapper({ type, data }: ChartWrapperProps) {
  switch (type) {
    case 'symptom':
      return (
        // @ts-ignore - Known type incompatibility with recharts components
        <ResponsiveContainer width="100%" height={200}>
          {/* @ts-ignore - Known type incompatibility with recharts components */}
          <LineChart data={data}>
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <CartesianGrid strokeDasharray="3 3" />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <XAxis dataKey="date" />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <YAxis />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <Tooltip />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <Legend />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <Line
              type="monotone"
              dataKey="intensity"
              stroke="#8884d8"
              name="Intensity"
            />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <Line
              type="monotone"
              dataKey="frequency"
              stroke="#82ca9d"
              name="Frequency"
            />
          </LineChart>
        </ResponsiveContainer>
      )
    case 'treatment':
      return (
        // @ts-ignore - Known type incompatibility with recharts components
        <ResponsiveContainer width="100%" height={200}>
          {/* @ts-ignore - Known type incompatibility with recharts components */}
          <BarChart data={data}>
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <CartesianGrid strokeDasharray="3 3" />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <XAxis dataKey="name" />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <YAxis yAxisId="left" orientation="left" />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <YAxis yAxisId="right" orientation="right" />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <Tooltip />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <Legend />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Usage Count" />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <Bar yAxisId="right" dataKey="avgIntensity" fill="#82ca9d" name="Avg. Intensity" />
          </BarChart>
        </ResponsiveContainer>
      )
    case 'qol':
      return (
        // @ts-ignore - Known type incompatibility with recharts components
        <ResponsiveContainer width="100%" height={200}>
          {/* @ts-ignore - Known type incompatibility with recharts components */}
          <BarChart data={data}>
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <CartesianGrid strokeDasharray="3 3" />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <XAxis dataKey="name" />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <YAxis />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <Tooltip />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <Legend />
            {/* @ts-ignore - Known type incompatibility with recharts components */}
            <Bar dataKey="impact" fill="#8884d8" name="Impact Level" />
          </BarChart>
        </ResponsiveContainer>
      )
    default:
      return null
  }
} 