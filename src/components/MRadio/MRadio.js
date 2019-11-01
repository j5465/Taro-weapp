import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import PropTypes from "prop-types";
import classNames from "classnames";
import AtComponent from "./Mcomponent";
import "./MRadio.scss";

export default class MRadio extends AtComponent {
  handleClick(option) {
    if (option.disabled) return;
    this.props.onClick(option.value, ...arguments);
  }

  render() {
    const {
      customStyle,
      className,
      options,
      value,
      choosefontsize,
      loading
    } = this.props;

    return (
      <View className={classNames("M-radio", className)} style={customStyle}>
        {options.map(option => (
          <View
            key={option.value}
            onClick={this.handleClick.bind(this, option)}
            className={classNames({
              "M-radio__option": true,
              "M-radio__option--disabled": option.disabled
            })}
          >
            <View className='M-radio__option-wrap'>
              <View className='M-radio__option-container'>
                <View
                  className='M-radio__title'
                  style={`font-size:${choosefontsize}`}
                >
                  {option.label}
                </View>
                <View
                  className={classNames({
                    "M-radio__icon": true,
                    "M-radio__icon--checked": value === option.value
                  })}
                >
                  {choosefontsize === undefined ? (
                    <Text className='at-icon at-icon-check'></Text>
                  ) : (
                    <View
                      className={loading == true ? "load_rotate" : "down_arrow"}
                    ></View>
                  )}
                </View>
              </View>
              {option.desc && (
                <View className='M-radio__desc'>{option.desc}</View>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  }
}
{
  /* {choosefontsize === undefined ? (
                    <Text className='Micon Mcon-check'>1</Text>
                  ) : (

                  )} */
}
MRadio.defaultProps = {
  customStyle: "",
  className: "",
  value: "",
  options: [],
  onClick: () => {},
  choosefontsize: undefined
};

MRadio.propTypes = {
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  value: PropTypes.string,
  options: PropTypes.array,
  onClick: PropTypes.func
};
