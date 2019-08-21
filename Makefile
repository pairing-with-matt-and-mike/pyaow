PPMS = balls.ppm rock.ppm clock.ppm sphere.ppm 3dSphere.ppm
PNGS := $(addsuffix .png,$(basename $(PPMS)))

%.png: %.ppm
	convert $^ $@

%.jpg: %.ppm
	convert $^ $@

%.ascii: %.jpg
	jp2a $^ > $@

serve: $(PNGS)
	python3 -m http.server
