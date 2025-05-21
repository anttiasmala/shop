import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Footer } from '~/components/Footer';
import { NavBar } from '~/components/NavBar';

export default function HandleProduct() {
  return (
    <main className="h-screen w-full bg-white">
      <div className="w-full">
        <NavBar />
      </div>
      <div className="flex w-full justify-center">
        <Link
          href={'/shop'}
          className="rounded-md border-4 border-black p-4 text-5xl font-bold"
        >
          Whoops! Nothing found!
        </Link>
      </div>
      <Footer />
    </main>
  );
}
