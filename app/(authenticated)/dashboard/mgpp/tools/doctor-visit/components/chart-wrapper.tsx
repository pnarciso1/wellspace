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
import { ResponsiveLine } from '@nivo/line'

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

export default function ChartWrapper({ data, type }: ChartWrapperProps) {
  switch (type) {
    case 'symptom':
      const transformedData = [
        {
          id: 'Intensity',
          data: data.map((d: any) => ({
            x: d.date,
            y: Number(d.intensity) || 0
          }))
        },
        {
          id: 'Frequency',
          data: data.map((d: any) => ({
            x: d.date,
            y: Number(d.frequency) || 0
          }))
        }
      ];
      return (
        <div style={{ width: '100%', height: '200px' }}>
          <ResponsiveLine
            data={transformedData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ 
              type: 'linear',
              min: 0,
              max: 5,
              stacked: false,
              reverse: false
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Date',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Scale',
              legendOffset: -40,
              legendPosition: 'middle',
              tickValues: [0, 1, 2, 3, 4, 5]
            }}
            enableGridX={false}
            enableGridY={true}
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            curve="monotoneX"
            colors={['#8884d8', '#82ca9d']}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      );
    case 'treatment':
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Usage Count" />
            <Bar yAxisId="right" dataKey="avgIntensity" fill="#82ca9d" name="Avg. Intensity" />
          </BarChart>
        </ResponsiveContainer>
      )
    case 'qol':
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="impact" fill="#8884d8" name="Impact Level" />
          </BarChart>
        </ResponsiveContainer>
      )
    default:
      return null
  }
} 