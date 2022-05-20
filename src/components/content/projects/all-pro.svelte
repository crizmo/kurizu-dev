<script>
	import {Route} from 'tinro'; 
	import ElinaCn from '../../channels/projects/elina-cn.svelte';
	import AnyanimeCn from '../../channels/projects/anyanime-cn.svelte';

	import Anyanime from '../projects/anyanime.svelte';
	import ElinaDev from '../projects/elina-dev.svelte';
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
</main>

<style>

</style>