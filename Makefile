PPMS = rock.ppm clock.ppm
PNGS := $(addsuffix .png,$(basename $(PPMS)))

%.png: %.ppm
	convert $^ $@

%.jpg: %.ppm
	convert $^ $@

%.ascii: %.jpg
	jp2a $^ > $@

serve: $(PNGS)
	python3 -m http.server
