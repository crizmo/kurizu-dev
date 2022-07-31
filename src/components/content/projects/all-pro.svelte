<script>
	import {Route} from 'tinro'; 
	import ElinaCn from '../../channels/projects/elina-cn.svelte';
	import AnyanimeCn from '../../channels/projects/anyanime-cn.svelte';
	import StreamSaversCn from '../../channels/projects/streamsavers-cn.svelte';
	import PixitCn from '../../channels/projects/pixit-cn.svelte';
	import BreezeCn from '../../channels/projects/breeze-cn.svelte';
	import MinikeyCn from '../../channels/projects/minikey-cn.svelte';

	import Anyanime from '../projects/anyanime.svelte';
	import ElinaDev from '../projects/elina-dev.svelte';
	import StreamSavers from '../projects/streamsavers.svelte';
	import Pixit from '../projects/pixit.svelte';
	import Breeze from '../projects/breeze.svelte';
	import Minikey from '../projects/minikey.svelte';
</script>

<main>
	<Route path="/anyanime">
		<AnyanimeCn />
		<Anyanime />
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

	<Route path="/breeze">
		<BreezeCn />
		<Breeze />
	</Route>

	<Route path="/minikey">
		<MinikeyCn />
		<Minikey />
	</Route>
</main>

<style>

</style>