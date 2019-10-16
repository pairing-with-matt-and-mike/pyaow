PPMS = balls-n-walls.ppm balls.ppm rock.ppm clock.ppm index.ppm sphere.ppm 3dSphere.ppm
PNGS := $(addsuffix .png,$(basename $(PPMS)))

%.png: %.ppm
	convert $^ $@

%.jpg: %.ppm
	convert $^ $@

%.ascii: %.jpg
	jp2a $^ > $@

serve: $(PNGS)
	python3.7 -m http.server
