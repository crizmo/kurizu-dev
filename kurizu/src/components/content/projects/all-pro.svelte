<script>
	import {Route} from 'tinro'; 
	import ElinaCn from '../../channels/projects/elina-cn.svelte';
	import AnyanimeCn from '../../channels/projects/anyanime-cn.svelte';
	import Image2urlCn from '../../channels/projects/image2url-cn.svelte';
	import StreamSaversCn from '../../channels/projects/streamsavers-cn.svelte';
	import PixitCn from '../../channels/projects/pixit-cn.svelte';
	import DiscordCardsCn from '../../channels/projects/discordcards-cn.svelte';
	import MinikeyCn from '../../channels/projects/minikey-cn.svelte';
	import Type3dCn from '../../channels/projects/type3d-cn.svelte';
	import TimelyCn from '../../channels/projects/timely-cn.svelte';
	import CordleCn from '../../channels/projects/cordle-cn.svelte';
	import EmoGitCn from '../../channels/projects/emogit-cn.svelte';

	import Anyanime from '../projects/anyanime.svelte';
	import Image2url from '../projects/image2url.svelte';
	import ElinaDev from '../projects/elina-dev.svelte';
	import StreamSavers from '../projects/streamsavers.svelte';
	import Pixit from '../projects/pixit.svelte';
	import DiscordCards from '../projects/discordcards.svelte';
	import Minikey from '../projects/minikey.svelte';
	import Type3d from '../projects/type3d.svelte';
	import Timely from '../projects/timely.svelte';
	import Cordle from '../projects/cordle.svelte';
	import EmoGit from '../projects/emogit.svelte';
</script>

<main>
	<Route path="/anyanime">
		<AnyanimeCn />
		<Anyanime />
	</Route>

	<Route path="/image2url">
		<Image2urlCn />
		<Image2url />
	</Route>

	<Route path="/elina">
		<ElinaCn />
		<ElinaDev />
	</Route>

	<Route path="/stream-savers">
		<StreamSaversCn />
		<StreamSavers />
	</Route>

	<Route path="/pixit">
		<PixitCn />
		<Pixit />
	</Route>

	<Route path="/discordcards">
		<DiscordCardsCn />
		<DiscordCards />
	</Route>

	<Route path="/minikey">
		<MinikeyCn />
		<Minikey />
	</Route>

	<Route path="/type3d">
		<Type3dCn />
		<Type3d />
	</Route>

	<Route path="/timely">
		<TimelyCn />
		<Timely />
	</Route>

	<Route path="/cordle">
		<CordleCn />
		<Cordle />
	</Route>

	<Route path="/emogit">
		<EmoGitCn />
		<EmoGit />
	</Route>
</main>