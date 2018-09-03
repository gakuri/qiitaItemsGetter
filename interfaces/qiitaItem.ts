interface QiitaItem{
	rendered_body: string,
	body: string,
	coediting: boolean,
	comments_count: number,
	created_at: Date,
	group: string,
	id: string,
	likes_count: number,
	private: boolean,
	reactions_count: number,
	tags: [
		{
			name: string,
			versions: Array<string>
		}
	],
	title: string,
	updated_at: Date,
	url: string,
	user: {
		description: string,
		facebook_id: string,
		followees_count: number,
		followers_count: number,
		github_login_name: string,
		id: string,
		items_count: number,
		linkedin_id: string,
		location: string,
		name: string,
		organization: string,
		permanent_id: number,
		profile_image_url: string,
		twitter_screen_name: string,
		website_url: string
	},
	page_views_count: number
}