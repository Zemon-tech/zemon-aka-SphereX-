"use client";

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, MinusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required'),
  mode: z.enum(['online', 'in-person', 'hybrid']),
  type: z.enum(['hackathon', 'workshop', 'conference', 'meetup', 'webinar']),
  capacity: z.number().optional(),
  registrationUrl: z.string().url().optional(),
  registrationDeadline: z.string().optional(),
  entryFee: z.object({
    amount: z.number().default(0),
    currency: z.string().default('USD')
  }).optional(),
  highlights: z.array(z.string()).default([]),
  speakers: z.array(z.object({
    name: z.string(),
    role: z.string().optional(),
    bio: z.string().optional(),
    image: z.string().optional(),
    social: z.object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      website: z.string().optional()
    }).optional()
  })).optional(),
  workshops: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    speaker: z.string().optional(),
    duration: z.string().optional(),
    requirements: z.string().optional()
  })).optional(),
  eligibility: z.string().optional(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional(),
  pastHighlights: z.array(z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional()
  })).optional(),
  sponsors: z.array(z.object({
    name: z.string(),
    logo: z.string().optional(),
    website: z.string().optional(),
    tier: z.enum(['platinum', 'gold', 'silver', 'bronze', 'partner']).optional()
  })).optional(),
  socialMedia: z.object({
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    discord: z.string().optional()
  }).optional(),
  contactInfo: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional()
  }).optional(),
  rewards: z.string().optional(),
  image: z.string(),
  tags: z.union([z.string(), z.array(z.string())]).transform(val => 
    typeof val === 'string' ? val.split(',').map(tag => tag.trim()).filter(Boolean) : val
  ).default([]),
  website: z.string().url().optional()
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  initialData?: Partial<EventFormData>;
  onCancel?: () => void;
}

export function EventForm({ onSubmit, initialData, onCancel }: EventFormProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 6;

  const { register, control, handleSubmit, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      mode: 'online',
      type: 'webinar',
      tags: [],
      highlights: [],
      speakers: [],
      workshops: [],
      faqs: [],
      sponsors: [],
      ...initialData
    }
  });

  const highlightArray = useFieldArray({
    control,
    name: 'highlights' as any
  });

  const speakerArray = useFieldArray({
    control,
    name: 'speakers' as any
  });

  const workshopArray = useFieldArray({
    control,
    name: 'workshops' as any
  });

  const faqArray = useFieldArray({
    control,
    name: 'faqs' as any
  });

  const sponsorArray = useFieldArray({
    control,
    name: 'sponsors' as any
  });

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = highlightArray;
  const { fields: speakerFields, append: appendSpeaker, remove: removeSpeaker } = speakerArray;
  const { fields: workshopFields, append: appendWorkshop, remove: removeWorkshop } = workshopArray;
  const { fields: faqFields, append: appendFaq, remove: removeFaq } = faqArray;
  const { fields: sponsorFields, append: appendSponsor, remove: removeSponsor } = sponsorArray;

  const handleClose = () => {
    setIsOpen(false);
    onCancel?.();
  };

  const handleFormSubmit = async (data: EventFormData) => {
    try {
      const formattedData = {
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : (typeof data.tags === 'string' ? (data.tags as string).split(',').map(tag => tag.trim()).filter(Boolean) : []),
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        speakers: Array.isArray(data.speakers) ? data.speakers : [],
        workshops: Array.isArray(data.workshops) ? data.workshops : [],
        faqs: Array.isArray(data.faqs) ? data.faqs : [],
        sponsors: Array.isArray(data.sponsors) ? data.sponsors : [],
        entryFee: data.entryFee || { amount: 0, currency: 'USD' },
        image: data.image || '/placeholder-event.jpg'
      };

      await onSubmit(formattedData);
      handleClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleAddHighlight = () => {
    (appendHighlight as any)('');
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
  return (
            <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register('title')} />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="type">Event Type</Label>
                <Select onValueChange={value => register('type').onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="meetup">Meetup</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input type="date" id="date" {...register('date')} />
                {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                </div>

              <div>
                <Label htmlFor="time">Time</Label>
                <Input type="time" id="time" {...register('time')} />
                {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}
              </div>

              <div>
                <Label htmlFor="mode">Mode</Label>
                <Select onValueChange={value => register('mode').onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="in-person">In-person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register('location')} />
                {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
          </div>
        );
      case 2:
        return (
            <div className="space-y-4">
            <h3 className="text-lg font-semibold">Registration Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="registrationUrl">Registration URL</Label>
                <Input id="registrationUrl" {...register('registrationUrl')} />
              </div>

              <div>
                <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                <Input type="date" id="registrationDeadline" {...register('registrationDeadline')} />
              </div>

              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input type="number" id="capacity" {...register('capacity', { valueAsNumber: true })} />
              </div>

              <div>
                <Label htmlFor="entryFee.amount">Entry Fee</Label>
                <div className="flex gap-2">
                  <Input type="number" {...register('entryFee.amount', { valueAsNumber: true })} placeholder="Amount" />
                  <Select onValueChange={value => register('entryFee.currency').onChange({ target: { value } })}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Highlights</h3>
            {highlightFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input {...register(`highlights.${index}`)} placeholder="Add a highlight" />
                <Button type="button" variant="ghost" onClick={() => removeHighlight(index)}>
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddHighlight}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Highlight
            </Button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Speakers & Workshops</h3>
            <div className="space-y-6">
              {/* Speakers Section */}
              <div className="space-y-4">
                <h4 className="text-md font-medium">Speakers</h4>
                {speakerFields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input {...register(`speakers.${index}.name`)} />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Input {...register(`speakers.${index}.role`)} />
                        </div>
                        <div>
                          <Label>Bio</Label>
                          <Textarea {...register(`speakers.${index}.bio`)} />
                        </div>
                        <div>
                          <Label>Image URL</Label>
                          <Input {...register(`speakers.${index}.image`)} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Twitter</Label>
                          <Input {...register(`speakers.${index}.social.twitter`)} />
                        </div>
                        <div>
                          <Label>LinkedIn</Label>
                          <Input {...register(`speakers.${index}.social.linkedin`)} />
                        </div>
                        <div>
                          <Label>Website</Label>
                          <Input {...register(`speakers.${index}.social.website`)} />
                        </div>
                      </div>
                      <Button type="button" variant="ghost" onClick={() => removeSpeaker(index)}>
                        <MinusCircle className="h-4 w-4 mr-2" /> Remove Speaker
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={() => appendSpeaker({
                  name: '',
                  role: '',
                  bio: '',
                  image: '',
                  social: { twitter: '', linkedin: '', website: '' }
                })}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Speaker
                </Button>
              </div>

              {/* Workshops Section */}
              <div className="space-y-4">
                <h4 className="text-md font-medium">Workshops</h4>
                {workshopFields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Title</Label>
                          <Input {...register(`workshops.${index}.title`)} />
                        </div>
                        <div>
                          <Label>Speaker</Label>
                          <Input {...register(`workshops.${index}.speaker`)} />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea {...register(`workshops.${index}.description`)} />
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <Input {...register(`workshops.${index}.duration`)} />
                        </div>
                        <div>
                          <Label>Requirements</Label>
                          <Textarea {...register(`workshops.${index}.requirements`)} />
                        </div>
                      </div>
                      <Button type="button" variant="ghost" onClick={() => removeWorkshop(index)}>
                        <MinusCircle className="h-4 w-4 mr-2" /> Remove Workshop
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={() => appendWorkshop({
                  title: '',
                  description: '',
                  speaker: '',
                  duration: '',
                  requirements: ''
                })}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Workshop
                </Button>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">FAQs & Sponsors</h3>
            <div className="space-y-6">
              {/* FAQs Section */}
              <div className="space-y-4">
                <h4 className="text-md font-medium">FAQs</h4>
                {faqFields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="space-y-4 pt-4">
                      <div>
                        <Label>Question</Label>
                        <Input {...register(`faqs.${index}.question`)} />
                      </div>
                      <div>
                        <Label>Answer</Label>
                        <Textarea {...register(`faqs.${index}.answer`)} />
                      </div>
                      <Button type="button" variant="ghost" onClick={() => removeFaq(index)}>
                        <MinusCircle className="h-4 w-4 mr-2" /> Remove FAQ
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={() => appendFaq({ question: '', answer: '' })}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add FAQ
                </Button>
              </div>

              {/* Sponsors Section */}
              <div className="space-y-4">
                <h4 className="text-md font-medium">Sponsors</h4>
                {sponsorFields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input {...register(`sponsors.${index}.name`)} />
                        </div>
                        <div>
                          <Label>Logo URL</Label>
                          <Input {...register(`sponsors.${index}.logo`)} />
                        </div>
                        <div>
                          <Label>Website</Label>
                          <Input {...register(`sponsors.${index}.website`)} />
                        </div>
                        <div>
                          <Label>Tier</Label>
                          <Select onValueChange={value => register(`sponsors.${index}.tier`).onChange({ target: { value } })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="platinum">Platinum</SelectItem>
                              <SelectItem value="gold">Gold</SelectItem>
                              <SelectItem value="silver">Silver</SelectItem>
                              <SelectItem value="bronze">Bronze</SelectItem>
                              <SelectItem value="partner">Partner</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" onClick={() => removeSponsor(index)}>
                        <MinusCircle className="h-4 w-4 mr-2" /> Remove Sponsor
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={() => appendSponsor({
                  name: '',
                  logo: '',
                  website: '',
                  tier: 'partner'
                })}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Sponsor
                </Button>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact & Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Info */}
              <div>
                <Label>Contact Email</Label>
                <Input {...register('contactInfo.email')} type="email" />
              </div>
              <div>
                <Label>Contact Phone</Label>
                <Input {...register('contactInfo.phone')} />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input {...register('contactInfo.whatsapp')} />
              </div>

              {/* Social Media */}
              <div>
                <Label>Twitter</Label>
                <Input {...register('socialMedia.twitter')} />
              </div>
              <div>
                <Label>Facebook</Label>
                <Input {...register('socialMedia.facebook')} />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input {...register('socialMedia.instagram')} />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input {...register('socialMedia.linkedin')} />
              </div>
              <div>
                <Label>Discord</Label>
                <Input {...register('socialMedia.discord')} />
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <div>
                <Label>Eligibility Criteria</Label>
                <Textarea {...register('eligibility')} />
              </div>
              <div>
                <Label>Rewards</Label>
                <Textarea {...register('rewards')} />
              </div>
              <div>
                <Label>Website</Label>
                <Input {...register('website')} />
              </div>
              <div>
                <Label>Event Image URL</Label>
                <Input {...register('image')} />
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input {...register('tags')} placeholder="tech, workshop, coding" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          <div className="space-y-4">
            {renderStepContent(currentStep)}
          </div>
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <Button
                  type="button"
                variant="outline"
                onClick={() => setCurrentStep(step => step - 1)}
              >
                Previous
              </Button>
            )}
            
            <div className="flex-1" />
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(step => step + 1)}
              >
                Next
              </Button>
            ) : (
              <Button type="submit">
                Create Event
              </Button>
            )}
              </div>

          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  currentStep === index + 1 ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
            </div>
          </form>
      </DialogContent>
    </Dialog>
  );
} 

export default EventForm; 