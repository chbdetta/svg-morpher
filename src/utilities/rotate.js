// rotate an array to left
export function rotate(arr, position) {
	position %= arr.length
	var i = 0, j = 0, n = arr.length,
		temp = arr[0], cur = arr[0]

	while (n --) {
		i = ( i + position + arr.length) % arr.length

		temp = arr[i]
		arr[i] = cur

		cur = temp

		if (i === j) {
			i ++
			j ++

			cur = arr[i]
		}
	}
}
