import React, { useEffect, useState } from 'react'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import ReactPlayer from 'react-player'

export default function Home({ movies }) {
	console.log(movies[0])
	const url = movies[0].attributes.data.episodes[0].server_data[0].link_m3u8

	const [hlsUrl, setHlsUrl] = useState()

	useEffect(() => setHlsUrl(url), [url])

	return (
		<div>
			{hlsUrl && <ReactPlayer
          key={hlsUrl} // this would create a new instance when the source is changed and would solve the issue of mounting and unmouting when changing the hls ...
          url={hlsUrl}
          className="react-player"
          // playing={playing}
          controls
          onError={(error, data, hlsInstance, hlsGlobal) => {
            console.log(error, data, hlsInstance, hlsGlobal);
          }}
          width="100%"
          height="100%"
        />}
		</div>
	)
}

export async function getStaticProps() {
	const client = new ApolloClient({
		uri: 'http://localhost:1337/graphql',
		cache: new InMemoryCache()
	})

	const { data } = await client.query({
		query: gql`
			query AllMovies {
				movies {
					data {
						id
						attributes {
							title
							slug
							data
						}
					}
				}
			}
		`
	})

	return {
		props: {
			movies: data.movies.data
		}
	}
}