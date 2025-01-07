'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Info, Trophy, Star } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrackId, HealthTracksData, MilestonesData, Milestone } from './types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/contexts/AuthContext';

const milestones: MilestonesData = {
  metabolic: [
    {
      day: 3,
      title: "Energy Explorer",
      message: "You've started your journey to natural vitality! These first steps are setting the foundation for lasting energy."
    },
    {
      day: 7,
      title: "Balance Builder",
      message: "One week in! Your body is starting to adapt to its natural rhythm. Many people notice improved morning energy by this point."
    },
    {
      day: 14,
      title: "Vitality Victor",
      message: "Two weeks of consistent progress! Your metabolism is learning to use energy more efficiently. Notice how your energy feels more stable?"
    },
    {
      day: 21,
      title: "Harmony Hero",
      message: "You've completed the full journey! Your new habits have set the stage for sustained energy and balance. What an achievement!"
    }
  ],
  hypertension: [
    {
      day: 3,
      title: "Flow Finder",
      message: "You've begun your journey to heart harmony! These initial steps are already supporting your cardiovascular wellness."
    },
    {
      day: 7,
      title: "Rhythm Ranger",
      message: "A full week of heart-healthy choices! Your body is responding to these positive changes with improved circulation."
    },
    {
      day: 14,
      title: "Wellness Warrior",
      message: "Two weeks strong! Your dedication to heart health is creating lasting positive changes. Feel the difference in your daily energy?"
    },
    {
      day: 21,
      title: "Heart Harmony Hero",
      message: "Congratulations on completing your journey! You've established a strong foundation for lasting heart health and vitality."
    }
  ]
};

const healthTracks: HealthTracksData = {
  metabolic: {
    title: "21-Day Energy & Balance Reset",
    description: "Simple daily steps to boost your natural energy and feel your best",
    tasks: [
      {
        week: 1,
        activities: [
          {
            task: "Drink a glass of water upon waking",
            explanation: "Hydrating first thing helps kickstart your metabolism and supports overall energy levels."
          },
          {
            task: "Take a 10-minute walk after lunch",
            explanation: "A short walk aids digestion and provides a natural energy boost to combat afternoon fatigue."
          },
          {
            task: "Practice deep breathing for 5 minutes before bed",
            explanation: "Deep breathing helps calm the nervous system, promoting better sleep quality and energy recovery."
          }
        ]
      },
      {
        week: 2,
        activities: [
          {
            task: "Incorporate a serving of leafy greens with lunch",
            explanation: "Leafy greens are rich in nutrients that support metabolic health and provide sustained energy."
          },
          {
            task: "Do 5 minutes of stretching in the morning",
            explanation: "Morning stretches improve circulation and flexibility, helping to energize your body for the day ahead."
          },
          {
            task: "Avoid screens for 30 minutes before bedtime",
            explanation: "Reducing blue light exposure before bed helps regulate your natural sleep-wake cycle for better rest and energy."
          }
        ]
      },
      {
        week: 3,
        activities: [
          {
            task: "Try a new healthy breakfast recipe",
            explanation: "Experimenting with nutritious breakfast options can help you find energizing meals you enjoy."
          },
          {
            task: "Practice mindfulness for 10 minutes during the day",
            explanation: "Mindfulness can reduce stress and improve focus, leading to better energy management throughout the day."
          },
          {
            task: "Establish a consistent bedtime routine",
            explanation: "A regular sleep schedule helps optimize your body's natural energy rhythms for better overall vitality."
          }
        ]
      }
    ]
  },
  hypertension: {
    title: "21-Day Heart & Flow Journey",
    description: "Natural daily practices to support your heart health and overall wellbeing",
    tasks: [
      {
        week: 1,
        activities: [
          {
            task: "Take a 15-minute leisurely walk",
            explanation: "Regular, gentle exercise helps improve circulation and supports heart health."
          },
          {
            task: "Add a serving of berries to your diet",
            explanation: "Berries are rich in antioxidants that support cardiovascular health."
          },
          {
            task: "Practice deep breathing for 5 minutes",
            explanation: "Deep breathing exercises can help lower blood pressure and reduce stress on the heart."
          }
        ]
      },
      {
        week: 2,
        activities: [
          {
            task: "Reduce sodium intake by avoiding processed foods",
            explanation: "Lower sodium intake helps maintain healthy blood pressure levels."
          },
          {
            task: "Try a new heart-healthy recipe",
            explanation: "Exploring heart-healthy cooking can make it easier to maintain a beneficial diet long-term."
          },
          {
            task: "Practice progressive muscle relaxation before bed",
            explanation: "This technique can help reduce overall tension and support better cardiovascular function."
          }
        ]
      },
      {
        week: 3,
        activities: [
          {
            task: "Incorporate 20 minutes of moderate exercise",
            explanation: "Regular moderate exercise strengthens the heart and improves overall cardiovascular health."
          },
          {
            task: "Add a serving of fatty fish to your weekly diet",
            explanation: "Omega-3 fatty acids found in fish support heart health and may help lower blood pressure."
          },
          {
            task: "Practice gratitude journaling for 5 minutes",
            explanation: "Focusing on positive emotions can help reduce stress and support heart health."
          }
        ]
      }
    ]
  }
};

const HealthTrack = () => {
  const [selectedTrack, setSelectedTrack] = useState<TrackId>('metabolic');
  const [progress, setProgress] = useState<Record<TrackId, boolean[]>>({
    metabolic: Array(21).fill(false),
    hypertension: Array(21).fill(false)
  });
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const [showMilestone, setShowMilestone] = useState<Milestone | null>(null);

  const supabase = createClientComponentClient();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('health_track_progress')
      .select('track_id, progress')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error loading progress:', error);
      return;
    }

    if (data) {
      const loadedProgress: Record<TrackId, boolean[]> = {
        metabolic: Array(21).fill(false),
        hypertension: Array(21).fill(false)
      };

      data.forEach(item => {
        loadedProgress[item.track_id as TrackId] = item.progress;
      });

      setProgress(loadedProgress);
    }
  };

  const saveProgress = async (trackId: TrackId, newProgress: boolean[]) => {
    if (!user) return;

    const { error } = await supabase
      .from('health_track_progress')
      .upsert({
        user_id: user.id,
        track_id: trackId,
        progress: newProgress
      }, {
        onConflict: 'user_id,track_id'
      });

    if (error) {
      console.error('Error saving progress:', error);
    }
  };

  const toggleTask = (trackId: TrackId, taskIndex: number) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        [trackId]: prev[trackId].map((done, i) => 
          i === taskIndex ? !done : done
        )
      };
      
      const completedTasks = newProgress[trackId].filter(Boolean).length;
      const milestone = milestones[trackId].find(m => m.day === completedTasks);
      if (milestone) {
        setShowMilestone(milestone);
      }
      
      saveProgress(trackId, newProgress[trackId]);
      return newProgress;
    });
  };

  const calculateProgress = (trackId: TrackId): number => {
    const completed = progress[trackId].filter(Boolean).length;
    return (completed / 21) * 100;
  };

  const getNextMilestone = (trackId: TrackId): Milestone | undefined => {
    const completedTasks = progress[trackId].filter(Boolean).length;
    return milestones[trackId].find(m => m.day > completedTasks);
  };

  const nextMilestone = getNextMilestone(selectedTrack);
  const completedTasks = progress[selectedTrack].filter(Boolean).length;
  const daysUntilNextMilestone = nextMilestone 
    ? nextMilestone.day - completedTasks 
    : 0;

  return (
    <div className="space-y-8 w-full max-w-4xl">
      <div className="flex gap-4">
        {(Object.keys(healthTracks) as TrackId[]).map((trackId) => (
          <button
            key={trackId}
            onClick={() => setSelectedTrack(trackId)}
            className={`px-4 py-2 rounded-lg ${
              selectedTrack === trackId
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {healthTracks[trackId].title}
          </button>
        ))}
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{healthTracks[selectedTrack].title}</CardTitle>
          <CardDescription>{healthTracks[selectedTrack].description}</CardDescription>
          
          <div className="mt-4">
            <Progress value={calculateProgress(selectedTrack)} />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                {Math.round(calculateProgress(selectedTrack))}% Complete
              </p>
              {nextMilestone && (
                <p className="text-sm text-blue-600 flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Next milestone: {nextMilestone.title} in {daysUntilNextMilestone} days
                </p>
              )}
            </div>
          </div>

          {showMilestone && (
            <Alert className="mt-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="font-semibold text-blue-700">{showMilestone.title}</h4>
                  <AlertDescription className="text-blue-600">
                    {showMilestone.message}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
        </CardHeader>

        <CardContent>
          {healthTracks[selectedTrack].tasks.map((week, weekIndex) => (
            <div key={weekIndex} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Week {week.week}</h3>
              <div className="space-y-3">
                {week.activities.map((activity, activityIndex) => {
                  const taskIndex = weekIndex * 3 + activityIndex;
                  return (
                    <div key={activityIndex} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="cursor-pointer"
                          onClick={() => toggleTask(selectedTrack, taskIndex)}
                        >
                          {progress[selectedTrack][taskIndex] ? (
                            <CheckCircle2 className="text-green-500" />
                          ) : (
                            <Circle className="text-gray-300" />
                          )}
                        </div>
                        <span className={progress[selectedTrack][taskIndex] ? 'line-through text-gray-500' : ''}>
                          {activity.task}
                        </span>
                        <Info
                          className="h-4 w-4 text-blue-500 cursor-pointer"
                          onClick={() => setShowExplanation(showExplanation === `${weekIndex}-${activityIndex}` ? null : `${weekIndex}-${activityIndex}`)}
                        />
                      </div>
                      {showExplanation === `${weekIndex}-${activityIndex}` && (
                        <Alert className="mt-2">
                          <AlertDescription>
                            {activity.explanation}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthTrack;

