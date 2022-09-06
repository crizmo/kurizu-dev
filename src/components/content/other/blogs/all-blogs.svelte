<script>
	import {Route} from 'tinro'; 
    import BlogsCn from '../../../channels/other/blogs-cn.svelte';
	import CelebrateToughTimes from './celebrate-tough-times.svelte';
</script>

<main>
	<Route path="/blogs/celebrate-tough-times">
        <BlogsCn />
        <CelebrateToughTimes />
    </Route>
</main>

<style>

</style>