"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  password: z.string().min(6)
});

export default function CreateAssistantPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema)
  });

  const handleSignup = async (data: any) => {
    try {
      setIsSubmitting(true);
      setError("");
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await setDoc(doc(db, 'assistants', userCredential.user.uid), {
        name: data.name,
        phone: data.phone,
        email: data.email,
        role: 'assistant',
        createdAt: new Date()
      });

      router.push('/dashboard/assistants');
    } catch (error: any) {
      setError(error.message || "Failed to create assistant");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Assistant</h1>
      <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input {...register('name')} id="name" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message?.toString()}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input {...register('phone')} id="phone" type="tel" />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message?.toString()}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input {...register('email')} id="email" type="email" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message?.toString()}</p>}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input {...register('password')} id="password" type="password" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message?.toString()}</p>}
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-4">{error}</p>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Assistant'
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/assistants')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
} 