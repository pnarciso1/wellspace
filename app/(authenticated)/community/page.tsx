"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from '@/lib/icons'

export default function Community() {
  const socialMediaLinks = [
    { platform: "BlueSky", handle: "@peoplecare.bsky.social", url: "https://bsky.app/profile/peoplecare.bsky.social" },
    { platform: "Truth Social", handle: "@peoplecareai", url: "https://truthsocial.com/@peoplecareai" },
    { platform: "Reddit", handle: "u/peoplecareai", url: "https://www.reddit.com/user/peoplecareai" },
    { platform: "X", handle: "@peoplecarai", url: "https://twitter.com/peoplecarai" },
    { platform: "TikTok", handle: "@peoplecareai", url: "https://www.tiktok.com/@peoplecareai" },
    { platform: "Instagram", handle: "@peoplecare.ai", url: "https://www.instagram.com/peoplecare.ai" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Wellspace Community Connector</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Connect for Better Health</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Welcome to the Wellspace Community Connector! We believe that wellness and health are significantly enhanced when you connect with others. Our community feature is designed to help you find valuable resources and support in your local area.
          </p>
          <p className="mb-4">
            Whether you're looking for support groups, fitness classes, mental health resources, or health education workshops, our Community Connector can help you find the right connections to support your health journey.
          </p>
          <p className="mb-4">
            Remember, you're not alone in your health journey. Connecting with others who share similar experiences or goals can provide motivation, support, and valuable insights. Use the Community Connector below to discover resources near you and take the first step towards a more connected, healthier you.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-0">
          <iframe 
            src="https://wellspacecommunityconnector-28562.chipp.ai" 
            height="800px" 
            width="100%" 
            frameBorder="0" 
            title="Wellspace Community Connector"
            className="w-full"
          ></iframe>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.Users className="mr-2" />
            Connect with Our Online Communities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            In addition to local resources, we invite you to join our vibrant online communities. Engage with fellow health enthusiasts, share your experiences, and stay updated with the latest health tips and news through our social media platforms:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialMediaLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block no-underline"
              >
                <Button variant="outline" className="w-full justify-start">
                  <Icons.MessageSquare className="mr-2 h-4 w-4" />
                  <span className="mr-2">{link.platform}:</span>
                  <span className="text-blue-500">{link.handle}</span>
                </Button>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
