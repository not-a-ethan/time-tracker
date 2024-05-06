'use client'

import type { NextPage } from 'next'

import Head from 'next/head'
import Script from 'next/script'

import { useSession, getSession } from "next-auth/react"

import { useForm, Controller } from 'react-hook-form';

// import styles from '../styles/Home.module.css'

import ProjectName from './projectName'

import Button  from '../../button'
import ShortTextInput  from '../../input'

function Page({ params }: { params: { slug: string } }) {
    const id = params.slug

    const renderContent = () => {
        if (Number(id) != id) {
            return (
                <p>The slug is not a number</p>
            )
        }

        return (
            <>
                <p>The project name is <span className='projectName'><ProjectName id={id} /></span></p>
            </>
        )
    }

    return renderContent();
}

export default Page;