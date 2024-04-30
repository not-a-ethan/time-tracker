import type { NextPage } from 'next'
import Head from 'next/head'
import Script from 'next/script'
import { useSession, getSession } from "next-auth/react"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form';

import styles from '../styles/Home.module.css'

import  Button  from '../../lib/components/button'
import  ShortTextInput  from '../../lib/components/input'

function Page({ params }: { params: { slug: string } }) {
    const router = useRouter()
    const slug = router.query.slug
    
    
}

export default Page;