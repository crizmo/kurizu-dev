<script>
	import {Route} from 'tinro'; 
	import ElinaCn from '../../channels/projects/elina-cn.svelte';
	import AnyanimeCn from '../../channels/projects/anyanime-cn.svelte';
	import Image2urlCn from '../../channels/projects/image2url-cn.svelte';
	import StreamSaversCn from '../../channels/projects/streamsavers-cn.svelte';
	import PixitCn from '../../channels/projects/pixit-cn.svelte';
	import BreezeCn from '../../channels/projects/breeze-cn.svelte';
	import MinikeyCn from '../../channels/projects/minikey-cn.svelte';
	import Type3dCn from '../../channels/projects/type3d-cn.svelte';
	import TimelyCn from '../../channels/projects/timely-cn.svelte';

	import Anyanime from '../projects/anyanime.svelte';
	import Image2url from '../projects/image2url.svelte';
	import ElinaDev from '../projects/elina-dev.svelte';
	import StreamSavers from '../projects/streamsavers.svelte';
	import Pixit from '../projects/pixit.svelte';
	import Breeze from '../projects/breeze.svelte';
	import Minikey from '../projects/minikey.svelte';
	import Type3d from '../projects/type3d.svelte';
	import Timely from '../projects/timely.svelte';
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

	<Route path="/breeze">
		<BreezeCn />
		<Breeze />
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
</main>