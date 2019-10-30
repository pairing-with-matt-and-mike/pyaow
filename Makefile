PPMS = $(wildcard *.ppm)
PNGS := $(addsuffix .png,$(basename $(PPMS)))

%.png: %.ppm
	convert $^ $@

%.jpg: %.ppm
	convert $^ $@

%.ascii: %.jpg
	jp2a $^ > $@

serve: $(PNGS)
	npx live-server --host=0.0.0.0 --port=8000 --ignorePattern=node_modules
