'use client'

import React from 'react'
import dynamic from 'next/dynamic'
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

interface SymptomChartProps {
  data: ChartData[];
  type: string;
}

interface TreatmentChartProps {
  data: Array<{
    name: "Medication" | "Physical Therapy" | "Rest" | "Lifestyle Changes" | "None of the Above";
    count: number;
    avgIntensity: number;
  }>;
}

interface QualityOfLifeChartProps {
  data: {
    name: string;
    impact: number;
  }[];
}

const ChartWrapper = dynamic(() => import('./chart-wrapper'), { ssr: false })

export function SymptomChart({ data, type }: SymptomChartProps) {
  return (
    <div className="h-[200px] mb-4">
      <div style={{ width: '100%', height: '100%' }}>
        <ChartWrapper data={data} type="symptom" />
      </div>
    </div>
  )
}

export function TreatmentChart({ data }: TreatmentChartProps) {
  return (
    <div className="h-[200px] mb-4">
      <div style={{ width: '100%', height: '100%' }}>
        <ChartWrapper data={data} type="treatment" />
      </div>
    </div>
  )
}

export function QualityOfLifeChart({ data }: QualityOfLifeChartProps) {
  return (
    <div className="h-[200px] mb-4">
      <div style={{ width: '100%', height: '100%' }}>
        <ChartWrapper data={data} type="qol" />
      </div>
    </div>
  )
} 