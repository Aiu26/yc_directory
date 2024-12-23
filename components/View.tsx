import React from 'react';
import Ping from '@/components/Ping';
import { client } from '@/sanity/lib/client';
import { STARTUP_VIEWS_QUERY } from '@/sanity/lib/queries';
import { writeClient } from '@/sanity/lib/write-client';
import { after } from 'next/server';

const View = async ({ id }: { id: string }) => {
	const { views: totalViews } = await client
		.withConfig({ useCdn: false })
		.fetch(STARTUP_VIEWS_QUERY, { id });

	after(async () => {
		await writeClient
			.patch(id)
			.set({ views: totalViews + 1 })
			.commit();
	});

	const formatNumber = (totalViews: number) => {
		if (totalViews > 1) {
			return <p>{totalViews} views</p>;
		} else {
			return <p>{totalViews} view</p>;
		}
	};

	return (
		<div className='view-container'>
			<div className='absolute -top-2 -right-2'>
				<Ping />
			</div>
			<p className='view-text'>
				<span className='font-black'> {formatNumber(totalViews)}</span>
			</p>
		</div>
	);
};

export default View;