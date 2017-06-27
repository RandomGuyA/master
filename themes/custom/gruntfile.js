module.exports = function(grunt) {
	require('jit-grunt')(grunt);
	
		grunt.initConfig({
				less: {
					development: {
						options: {
							paths: ["css"]
						},
						files: {"css/style.css": "less/**/*.less"}
					}
				},
				uglify: {
					build: {
						src: 'js/main.js',
						dest: 'js/main.min.js'
					}
				},
				concat: {
					options: {
						separator: ';'
					},
					dist: {
						// the files to concatenate
						src: ['scripts/**/*.js'],
						// the location of the resulting JS file
						dest: 'js/main.js'
					}
				},
				watch: {
					scripts: {
						files: 'scripts/**/*.js',
						tasks: ['concat', 'uglify:build'],
						options: {
							atBegin: true
						}
					},
					styles: {
						files: ['less/**/*.less'], // which files to watch
						tasks: ['less'],
						options: {
							nospawn: true
						}
					}
			}
	});
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['less', 'concat', 'watch', 'uglify']);


};